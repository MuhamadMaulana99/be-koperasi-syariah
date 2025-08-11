const { Op } = require("sequelize");
const {
  models: { masterNasabah }
} = require("../../model/index.js");

module.exports = {
  // ✅ Tambah nasabah
  addNasabah: async (req, res) => {
    const {
      nama,
      mstRekening,
      mstNik,
      mstjenisKelamin,
      mstAlamat,
      mstKecamatan,
      mstKabupaten,
      mstProvinsi
    } = req.body;

    try {
      const errors = [];

      // Cek nama
      const isNamaExist = await masterNasabah.findOne({ where: { nama } });
      if (isNamaExist) errors.push("nama");

      // Cek NIK
      const isNikExist = await masterNasabah.findOne({ where: { mstNik } });
      if (isNikExist) errors.push("NIK");

      // Cek No Rekening
      const isRekeningExist = await masterNasabah.findOne({ where: { mstRekening } });
      if (isRekeningExist) errors.push("No Rekening");

      if (errors.length > 0) {
        return res.status(400).json({
          message: `Field duplikat: ${errors.join(", ")}`
        });
      }

      const add = await masterNasabah.create({
        nama,
        mstRekening,
        mstNik,
        mstjenisKelamin,
        mstAlamat,
        mstKecamatan,
        mstKabupaten,
        mstProvinsi
      });

      res.status(201).json(add);
    } catch (error) {
      console.error("Error saat menambahkan nasabah:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  },

  // ✅ Ambil semua nasabah
  getNasabah: async (req, res) => {
    try {
      const get = await masterNasabah.findAll({
        attributes: [
          "id",
          "nama",
          "mstNik",
          "mstRekening",
          "mstjenisKelamin",
          "mstAlamat",
          "mstKecamatan",
          "mstKabupaten",
          "mstProvinsi"
        ]
      });

      const val = get?.map((value) => {
        return {
          ...value.dataValues,
          mstjenisKelamin: JSON.parse(value?.mstjenisKelamin)
        };
      });

      res.json(val);
    } catch (error) {
      console.error("Error getNasabah:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  },

  // ✅ Ambil nasabah by ID
  getNasabahId: async (req, res) => {
    const { id } = req.params;
    try {
      const get = await masterNasabah.findOne({ where: { id } });

      if (get) {
        return res.status(200).json(get);
      } else {
        return res.status(404).json({ message: "Record not found" });
      }
    } catch (error) {
      console.error("Error getNasabahId:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // ✅ Ambil nasabah by No Rekening
  getNasabahRekening: async (req, res) => {
    const { mstRekening } = req.params;
    try {
      const get = await masterNasabah.findOne({ where: { mstRekening } });

      if (get) {
        return res.status(200).json(get);
      } else {
        return res.status(404).json({ message: "Record not found" });
      }
    } catch (error) {
      console.error("Error getNasabahRekening:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // ✅ Ubah nasabah
  putNasabah: async (req, res) => {
    const id = req.params.id;
    const {
      nama,
      mstNik,
      mstRekening,
      mstjenisKelamin,
      mstAlamat,
      mstKecamatan,
      mstKabupaten,
      mstProvinsi
    } = req.body;

    try {
      const errors = [];

      // Cek nama (kecuali dirinya sendiri)
      const isNamaExist = await masterNasabah.findOne({
        where: { nama, id: { [Op.ne]: id } }
      });
      if (isNamaExist) errors.push("nama");

      // Cek NIK
      const isNikExist = await masterNasabah.findOne({
        where: { mstNik, id: { [Op.ne]: id } }
      });
      if (isNikExist) errors.push("NIK");

      // Cek Rekening
      const isRekeningExist = await masterNasabah.findOne({
        where: { mstRekening, id: { [Op.ne]: id } }
      });
      if (isRekeningExist) errors.push("No Rekening");

      if (errors.length > 0) {
        return res.status(400).json({
          message: `Field duplikat: ${errors.join(", ")}`
        });
      }

      const put = await masterNasabah.update(
        {
          nama,
          mstNik,
          mstRekening,
          mstjenisKelamin,
          mstAlamat,
          mstKecamatan,
          mstKabupaten,
          mstProvinsi
        },
        {
          where: { id }
        }
      );

      res.json({ message: "Berhasil mengubah data", data: put });
    } catch (error) {
      console.error("Error saat mengubah nasabah:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  },


  // ✅ Hapus nasabah
  deleteNasabah: async (req, res) => {
    const id = req.params.id;

    try {
      const del = await masterNasabah.destroy({ where: { id } });

      if (del === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      return res.json({ message: "Berhasil menghapus data", id });
    } catch (error) {
      console.error("Error saat menghapus nasabah:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }
};
