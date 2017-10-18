import { PresentationPage } from './app.po';

describe('presentation App', () => {
  let page: PresentationPage;

  beforeEach(() => {
    page = new PresentationPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
