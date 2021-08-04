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
      this.throwError(err);
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
}

export { Http };
