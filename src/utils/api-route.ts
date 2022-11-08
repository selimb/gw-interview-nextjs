import { NextApiHandler } from "next";

interface ApiRouteHandlers {
  get?: NextApiHandler;
  post?: NextApiHandler;
  patch?: NextApiHandler;
  put?: NextApiHandler;
  delete?: NextApiHandler;
}

export function apiRoute(handlers: ApiRouteHandlers): NextApiHandler {
  handlers = Object.fromEntries(
    Object.entries(handlers).filter(
      ([_verb, handler]) => typeof handler !== "undefined"
    )
  );
  const supportedMethods = Object.keys(handlers);

  return async (req, res) => {
    const method = req.method?.toLowerCase() as keyof ApiRouteHandlers;
    const handler = handlers[method];

    try {
      if (!handler) {
        throw new MethodNotAllowedError(method, supportedMethods);
      }
      await handler(req, res);
    } catch (error) {
      if (!(error instanceof HttpError)) {
        // Let nextjs' error handler deal with it.
        throw error;
      }
      res.status(error.statusCode);
      for (const [headerName, headerValue] of Object.entries(error.headers())) {
        res.setHeader(headerName, headerValue);
      }
      res.json(error.toJson());
      res.end();
    }
  };
}

type HttpErrorDetail = string | Array<unknown> | Record<string, unknown>;
type HttpErrorCode = string;
type HttpErrorArgs = {
  statusCode: number;
  detail: HttpErrorDetail;
  code: HttpErrorCode;
};

/**
 * Base error class for HTTP errors.
 *
 * Can be constructed if none of the subclasses fit.
 */
export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly code: HttpErrorCode;
  public readonly detail: HttpErrorDetail;

  constructor(
    { statusCode, detail, code }: HttpErrorArgs = {
      statusCode: 500,
      detail: "Internal server error occurred.",
      code: "internal_server_error",
    }
  ) {
    super(`HTTP ${statusCode} ${code}`);
    this.code = code;
    this.detail = detail;
    this.statusCode = statusCode;
  }

  public toJson(): unknown {
    return { code: this.code, detail: this.detail };
  }

  public headers(): Record<string, string> {
    return {};
  }
}

export class MethodNotAllowedError extends HttpError {
  public method: string;
  public readonly allowedMethods: string[];

  constructor(method: string, allowedMethods: string[]) {
    method = method.toUpperCase();
    allowedMethods = allowedMethods.map((s) => s.toUpperCase());
    super({
      statusCode: 405,
      detail: `HTTP method '${method}' not allowed for this endpoint. Expected one of: ${allowedMethods.join(
        ", "
      )}`,
      code: "method_not_allowed",
    });
    this.method = method;
    this.allowedMethods = allowedMethods;
  }

  public headers() {
    return {
      Allow: this.allowedMethods.join(", "),
    };
  }
}
