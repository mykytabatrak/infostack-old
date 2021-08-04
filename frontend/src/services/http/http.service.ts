import { HttpError } from 'exceptions/exceptions';
import {
  ContentType,
  HttpHeader,
  HttpMethod,
  LocalStorageVariable,
  HttpCode,
} from 'common/enums/enums';
import { HttpOptions } from 'common/types/types';

class Http {
  public async load<T = unknown>(
    url: string,
    options: Partial<HttpOptions> = {},
  ): Promise<T> {
    try {
      const { method = HttpMethod.GET, payload = null, contentType } = options;
      const token = localStorage.getItem(LocalStorageVariable.ACCESS_TOKEN);
      const headers = this.getHeaders(contentType, token);

      const response = await fetch(url, {
        method,
        headers,
        body: payload,
      });

      this.checkStatus(response);

      if (response.status === HttpCode.NO_CONTENT) {
        return null as unknown as T;
      }

      return this.parseJSON<T>(response);
    } catch (err) {

      if (err.name === 'TokenExpiredError') {
        const response = await this.handleAccessTokenExpiredError(url, options, err);
        return this.parseJSON<T>(response);
      } else {
        this.throwError(err);
      }

    }
  }

  private getHeaders(
    contentType?: ContentType,
    token?: string | null,
  ): Headers {
    const headers = new Headers();

    if (contentType) {
      headers.append(HttpHeader.CONTENT_TYPE, contentType);
    }

    if (token) {
      headers.append(HttpHeader.AUTHORIZATION, `Bearer ${token}`);
    }

    return headers;
  }

  private checkStatus(response: Response): Response {
    if (!response.ok) {
      throw new HttpError({
        status: response.status,
      });
    }

    return response;
  }

  private parseJSON<T>(response: Response): Promise<T> {
    return response.json();
  }

  private throwError(err: Error): never {
    throw err;
  }

  private handleAccessTokenExpiredError = async (
    url: string,
    options: Partial<HttpOptions> = {},
    err: Error,
  ): Promise<Response> => {
    const refreshToken = localStorage.getItem(LocalStorageVariable.REFRESH_TOKEN);
    if (refreshToken) {
      try {
        const res = await fetch('/api/auth/refresh', {
          method: HttpMethod.POST,
          body: JSON.stringify({ refreshToken }),
          headers: this.getHeaders(ContentType.JSON),
        });
        const tokens = await res.json();
        localStorage.setItem(LocalStorageVariable.ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(LocalStorageVariable.REFRESH_TOKEN, tokens.refreshToken);
        const { method = HttpMethod.GET, payload = null, contentType } = options;
        const headers = this.getHeaders(contentType, tokens.accessToken);
        const response = await fetch(url, {
          method,
          headers,
          body: payload,
        });
        return response;
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          localStorage.removeItem(LocalStorageVariable.ACCESS_TOKEN);
          localStorage.removetem(LocalStorageVariable.REFRESH_TOKEN);
          localStorage.setItem(LocalStorageVariable.IS_REFRESH_TOKEN_EXPIRED, 'true');
        }
        this.throwError(error);
      }
    } else {
      this.throwError(err);
    }
  };
}

export { Http };
