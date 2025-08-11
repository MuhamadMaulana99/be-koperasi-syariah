const {
  models: { pengajuan },
} = require("../../model/index.js");
const { Model, Sequelize, DataTypes } = require("sequelize");

module.exports = {
  // Pada fungsi addPengajuan
  addPengajuan: async (req, res) => {
    try {
      const {
        rekening,
        namaNasabah,
        penjualan,
        hargaPokok,
        biaya,
        labaUsaha,
        pendapatanLain,
        jumlahPendapatan,
        kebutuhanRumahTangga,
        biayaPendidikan,
        biayaLainya,
        jumlahBiayaLuarUsaha,
        pendapatanBersih,
        rasioAngsuran,
        jangkaWaktu,
        nominalPermohonan,
        tujuanPembiayaan,
        jaminan,
        accPermohonan,
        status,
        statusBy,
        statusAt,
        foto,
      } = req.body;

      // Cek jika accPermohonan minus, set status menjadi "0"
      const finalStatus = accPermohonan < 0 ? "0" : status;

      // Generate nomorAkad otomatis
      const tahunSekarang = new Date().getFullYear();
      const jumlahPengajuanTahunIni = await pengajuan.count({
        where: Sequelize.where(
          Sequelize.fn("YEAR", Sequelize.col("createdAt")),
          tahunSekarang
        ),
      });
      const nomorUrut = 1000 + jumlahPengajuanTahunIni;
      const nomorAkad = `BMI/${tahunSekarang}/${nomorUrut}`;

      const add = await pengajuan.create({
        rekening,
        namaNasabah,
        penjualan,
        hargaPokok,
        biaya,
        labaUsaha,
        pendapatanLain,
        jumlahPendapatan,
        kebutuhanRumahTangga,
        biayaPendidikan,
        biayaLainya,
        jumlahBiayaLuarUsaha,
        pendapatanBersih,
        rasioAngsuran,
        jangkaWaktu,
        nominalPermohonan,
        tujuanPembiayaan,
        jaminan,
        accPermohonan,
        nomorAkad,
        status: finalStatus, // Gunakan finalStatus di sini
        statusBy,
        statusAt,
        foto,
      });

      res.status(201).json({
        message: "Pengajuan created successfully",
        data: add,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error adding pengajuan",
        error: error.message,
      });
    }
  },

  getPengajuan: async (req, res) => {
    try {
      const get = await pengajuan.findAll({
        attributes: [
          "id",
          "rekening",
          "namaNasabah",
          "penjualan",
          "hargaPokok",
          "biaya",
          "labaUsaha",
          "pendapatanLain",
          "jumlahPendapatan",
          "kebutuhanRumahTangga",
          "biayaPendidikan",
          "biayaLainya",
          "jumlahBiayaLuarUsaha",
          "pendapatanBersih",
          "rasioAngsuran",
          "jangkaWaktu",
          "nominalPermohonan",
          "tujuanPembiayaan",
          "jaminan",
          "accPermohonan",
          "nomorAkad",
          "status",
          "statusBy",
          "statusAt",
          "foto",
        ],
      });
      const val = get?.map((value) => {
        return {
          ...value.dataValues,
          namaNasabah: JSON.parse(value?.namaNasabah),
          rekening: JSON.parse(value?.rekening),
        };
      });
      res.json(val);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching pengajuan", error: error.message });
    }
  },

  approvalPengajuan: async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const put = await pengajuan.update(
        {
          status,
        },
        {
          where: {
            id,
          },
        }
      );
      res.json(put);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error approving pengajuan", error: error.message });
    }
  },

  getPengajuanByNoAkad: async (req, res) => {
    try {
      const get = await pengajuan.findAll({
        where: {
          nomorAkad: {
            [Sequelize.Op.not]: null,
          },
        },
        attributes: ["id", "nomorAkad", "namaNasabah"],
      });
      res.json(get);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching pengajuan by nomor akad",
        error: error.message,
      });
    }
  },

  putPengajuan: async (req, res) => {
    try {
      const id = req.params.id;
      const {
        rekening,
        namaNasabah,
        penjualan,
        hargaPokok,
        biaya,
        labaUsaha,
        pendapatanLain,
        jumlahPendapatan,
        kebutuhanRumahTangga,
        biayaPendidikan,
        biayaLainya,
        jumlahBiayaLuarUsaha,
        pendapatanBersih,
        rasioAngsuran,
        jangkaWaktu,
        nominalPermohonan,
        tujuanPembiayaan,
        jaminan,
        accPermohonan,
        nomorAkad,
        status,
        statusBy,
        statusAt,
        foto,
      } = req.body;
      const put = await pengajuan.update(
        {
          rekening,
          namaNasabah,
          penjualan,
          hargaPokok,
          biaya,
          labaUsaha,
          pendapatanLain,
          jumlahPendapatan,
          kebutuhanRumahTangga,
          biayaPendidikan,
          biayaLainya,
          jumlahBiayaLuarUsaha,
          pendapatanBersih,
          rasioAngsuran,
          jangkaWaktu,
          nominalPermohonan,
          tujuanPembiayaan,
          jaminan,
          accPermohonan,
          nomorAkad,
          status,
          statusBy,
          statusAt,
          foto,
        },
        {
          where: {
            id,
          },
        }
      );
      res.json(put);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating pengajuan", error: error.message });
    }
  },

  deletePengajuan: async (req, res) => {
    try {
      const id = req.params.id;
      const del = await pengajuan.destroy({
        where: {
          id,
        },
      });
      res.json({ message: "Pengajuan deleted successfully", id });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting pengajuan", error: error.message });
    }
  },
};
