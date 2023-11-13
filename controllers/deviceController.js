// import { query } from "express"
import { Device, DeviceInfo } from "../models/models.js";
import FileService from "../services/fileService.js";
import ApiError from "../error/ApiError.js";

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      let img = FileService.save(req.files?.img) ?? "";
      let device = await Device.create({ name, price, brandId, typeId, img });

      if (info) {
        info = JSON.parse(info);
        info.forEach((element) =>
          DeviceInfo.create({
            title: element.title,
            description: element.description,
            deviceId: device.id,
          })
        );
      }

      return res.json(device);
    } catch (e) {
      console.log(e);
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;

    let devices;
    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset });
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      });
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      });
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId, brandId },
        limit,
        offset,
      });
    }
    return res.json(devices);
  }

  async getOne(req, res) {
    let { id } = req.params;
    let device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });
    res.json(device);
  }
}
export const deviceController = new DeviceController();
