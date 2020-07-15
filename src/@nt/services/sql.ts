/**
 * TypeORM CRUD 服务基类
 */
export class SQLService {
  constructor(protected readonly repository) {}

  /**
   * 根据条件查询列表
   * @param query 查询条件
   */
  async findAll(query) {
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);
    delete query._page;
    delete query._pageSize;

    const result = await this.repository.findAndCount({
      where: query,
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return {
      page,
      pageSize,
      list: result[0],
      count: result[1],
    };
  }

  /**
   * 创建对象
   * @param dto
   */
  async create(dto) {
    return await this.repository.save(dto);
  }

  /**
   * 获取单个对象
   * @param id
   */
  async findOne(id) {
    const result = await this.repository.findOne(id) || [];
    if (result.length === 0) {
      return {};
    }
    return result;
  }

  /**
   * 更新对象
   * @param id
   * @param dto
   */
  async update(id, dto) {
    const toUpdate = await this.repository.findOne(id);
    Object.assign(toUpdate, dto);
    return await this.repository.save(toUpdate);
  }

  /**
   * 删除对象
   * @param id
   */
  async delete(id) {
    const toRemove = await this.repository.findOne(id);
    return await this.repository.remove(toRemove);
  }

}
