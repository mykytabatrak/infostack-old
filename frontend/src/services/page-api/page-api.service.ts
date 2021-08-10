import { ContentType, HttpMethod } from 'common/enums/enums';
import { IPage, IPageRequest, IPageNav } from 'common/interfaces/pages';
import { http } from 'services/http/http.service';

class PageApi {
  private http = http;
  private BASE = '/api/pages';

  public async createPage(payload: IPageRequest): Promise<IPage> {
    return this.http.load(this.BASE, {
      method: HttpMethod.POST,
      contentType: ContentType.JSON,
      payload: JSON.stringify(payload),
    });
  }

  public async createVersionPage(payload: IPageRequest): Promise<IPageNav> {
    return this.http.load(`${this.BASE}/:id/version`, {
      method: HttpMethod.POST,
      contentType: ContentType.JSON,
      payload: JSON.stringify(payload),
    });
  }

  public async getPages(): Promise<IPageNav[]> {
    return this.http.load(this.BASE, {
      method: HttpMethod.GET,
    });
  }

  public async getPage(id?: string ): Promise<IPage> {
    return this.http.load(`${this.BASE}/${id}`, {
      method: HttpMethod.GET,
    });
  }

}

export { PageApi };
