import User from '../models/user.model.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Không trả về mật khẩu
        });
        res.status(200).json(users);
    } catch (error) {   
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
    }
}

// Xóa người dùng (Cho Admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.json({ message: "Đã xóa người dùng thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa người dùng" });
  }
};

// Lấy thông tin cá nhân (Cho User xem profile mình)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
        attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ message: "Không tìm thấy User" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy thông tin cá nhân" });
  }
};