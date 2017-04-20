import { ReaderPage } from './app.po';

describe('reader App', () => {
  let page: ReaderPage;

  beforeEach(() => {
    page = new ReaderPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
