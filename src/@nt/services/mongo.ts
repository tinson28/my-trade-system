/**
 * Mongoose CRUD 服务基类
 */
export class MongoService {
  constructor(protected readonly model) {}

  /**
   * 根据条件查询列表
   * @param query 查询条件
   */
  async findAll(query) {
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);
    delete query._page;
    delete query._pageSize;

    const count = await this.model.countDocuments(query);
    const list = await this.model
      .find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
    return { page, pageSize, list, count };
  }

  /**
   * 创建对象
   * @param dto
   */
  async create(dto) {
    const created = new this.model(dto);
    return await created.save();
  }

  /**
   * 获取单个对象
   * @param id
   */
  async findOne(id) {
    // let rsult = null;
    // try {
    //   rsult =  (await this.model.findById(id).exec()) || {};
    // } catch (err) {
    //   console.log(err);
    //   return err;
    // }
    // return rsult;
    return (await this.model.findById(id).exec()) || {};
  }

  /**
   * 更新对象
   * @param id
   * @param dto
   */
  async update(id, dto) {
    return await this.model.findByIdAndUpdate(id, dto, { new: true });
  }

  /**
   * 删除对象
   * @param id
   */
  async delete(id) {
    return await this.model.findByIdAndRemove(id);
  }
}
