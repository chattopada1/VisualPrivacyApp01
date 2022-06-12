class editTools {
  constructor(imageSource) {
    this.imageSource = imageSource;
    this.modificationArray = [];
    this.mat = cv.imread(imageSource);
  }
}