//  some features to query like search, filter and pagination

class ApiFeatures {
  constructor(
    query,
    queryStr // means keyword
  ) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // SEARCH  feature
  search() {
    const keyword = this.queryStr?.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  //  FILTER feature
  filter() {
    const queryCopy = { ...this.queryStr };

    // removing few fields for category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // filter for price and rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // PAGINATION feature
  pagination(resultPerPage) {
    // default results per page is 5
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export default ApiFeatures;
