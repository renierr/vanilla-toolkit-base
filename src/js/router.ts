class Router {
  private currentPath: string | null = null;
  private payload: any = null;

  constructor() {
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
    this.handleHashChange();
  }

  public goTo(path: string, payload: any = null) {
    this.payload = payload;
    window.location.hash = path;
  }

  public goBack() {
    window.history.back();
  }

  public goOverview() {
    this.goTo('');
  }

  public getCurrentPath(): string | null {
    return this.currentPath;
  }

  /**
   * Returns the payload and clears it.
   */
  public consumePayload(): any {
    const p = this.payload;
    this.payload = null;
    return p;
  }

  private handleHashChange() {
    this.currentPath = window.location.hash.slice(1) || null;
  }
}

const router = new Router();
export default router;
