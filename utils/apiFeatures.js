class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1a. Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //1b. Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    //2. Sorting
    const { sort } = this.queryString;
    if (sort) {
      if (typeof sort === 'object')
        this.query = this.query.sort(sort.join(' ')); // Jeśli deklarujemy sort jako kilka parametrów z różnymi wartościami
      if (typeof sort === 'string')
        this.query = this.query.sort(sort.split(',').join(' ')); //Jeśli deklarujemy sort jako jeden parametr z wartościami oddzielonymi przecinkiem
    } else {
      this.query = this.query.sort('createdAt');
    }
    return this;
  }

  limitFields() {
    //3. Fileld limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    //4. Pagination
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
