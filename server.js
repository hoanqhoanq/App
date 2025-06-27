const express = require("express");
const mysql = require("mysql2");
const moment = require("moment-timezone");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); // Import uuidv4
const path = require("path");

// Kết nối cơ sở dữ liệu
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "doan",
});
const app = express();
const port = 3000;
// import multer
const multer = require("multer");

// Hàm tạo 6 chữ số ngẫu nhiên cho tên file
const generateRandomFilename = () => {
  const random = Math.floor(100000 + Math.random() * 900000); // 6 số ngẫu nhiên
  return `${random}`;
};

// Cấu hình multer để lưu ảnh với tên ngẫu nhiên
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thư mục lưu ảnh
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Lấy phần mở rộng của file
    const randomName = generateRandomFilename(); // Tạo tên file ngẫu nhiên
    cb(null, `${randomName}${ext}`); // Ví dụ: 123456.jpg
  },
});

const upload = multer({ storage: storage });

app.use(express.json()); // Để xử lý JSON trong body

// API: Upload ảnh
app.post("/upload", upload.single("image"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("Không có file được upload.");
  }

  // Chỉ trả về tên file ngẫu nhiên
  const imageFilename = file.filename;
  res.send({ imageFilename });
});
//Lấy banner
app.get("/banners", (req, res) => {
  const sql =
    "SELECT id, images AS images, created_at FROM banner ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching banners:", err);
      return res.status(500).json({ error: "Lỗi server khi lấy banner" });
    }

    // Trả về mảng banner
    res.json(results);
  });
});
//Xóa banner
app.delete("/banners/:id", (req, res) => {
  const bannerId = req.params.id;

  // Kiểm tra banner tồn tại
  db.query("SELECT * FROM banner WHERE id = ?", [bannerId], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Lỗi server khi kiểm tra banner" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Banner không tồn tại" });
    }

    // Xóa banner
    db.query("DELETE FROM banner WHERE id = ?", [bannerId], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ message: "Lỗi server khi xóa banner" });
      }

      res.json({ message: "Xóa banner thành công" });
    });
  });
});
//Thêm banner
app.post("/banners", upload.single("image"), (req, res) => {
  const file = req.file;

  if (!file) {
    console.log("Không có file được gửi lên");
    return res.status(400).json({ message: "Bạn cần gửi file ảnh." });
  }

  console.log("File đã được upload tạm thời:", file.filename);
  const fs = require("fs");
  const ext = path.extname(file.originalname);
  const newFilename = generateRandomFilename() + ext;

  const oldPath = path.join(__dirname, "uploads", file.filename);
  const newPath = path.join(__dirname, "uploads", newFilename);

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error("Lỗi khi đổi tên file:", err);
      return res.status(500).json({ message: "Lỗi khi đổi tên file." });
    }

    console.log(`Đổi tên file thành công: ${file.filename} -> ${newFilename}`);

    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    const sql = "INSERT INTO banner (images, created_at) VALUES (?, ?)";

    db.query(sql, [newFilename, createdAt], (err, results) => {
      if (err) {
        console.error("Lỗi khi thêm banner vào database:", err);
        return res.status(500).json({ message: "Lỗi khi thêm banner." });
      }

      console.log("Thêm banner thành công, ID:", results.insertId);
      res
        .status(201)
        .json({ message: "Banner đã được thêm.", id: results.insertId });
    });
  });
});
// Update banner theo id
app.put("/updatebanners/:id", upload.single("image"), (req, res) => {
  const bannerId = req.params.id;
  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ message: "Bạn cần gửi file ảnh để update banner." });
  }

  // Bước 1: Lấy thông tin banner cũ trong DB để biết file ảnh cũ (để xóa)
  const getBannerSql = "SELECT images FROM banner WHERE id = ?";
  db.query(getBannerSql, [bannerId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy banner từ database:", err);
      return res.status(500).json({ message: "Lỗi khi lấy banner." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Banner không tồn tại." });
    }

    const oldFilename = results[0].images;

    // Bước 2: Đổi tên file upload mới
    const fs = require("fs");
    const ext = path.extname(file.originalname);
    const newFilename = generateRandomFilename() + ext;

    const oldPath = path.join(__dirname, "uploads", file.filename);
    const newPath = path.join(__dirname, "uploads", newFilename);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error("Lỗi khi đổi tên file:", err);
        return res.status(500).json({ message: "Lỗi khi đổi tên file." });
      }

      // Bước 3: Cập nhật database với tên file mới
      const updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
      const updateSql =
        "UPDATE banner SET images = ?, created_at = ? WHERE id = ?";

      db.query(
        updateSql,
        [newFilename, updatedAt, bannerId],
        (err, results) => {
          if (err) {
            console.error("Lỗi khi cập nhật banner trong database:", err);
            return res
              .status(500)
              .json({ message: "Lỗi khi cập nhật banner." });
          }

          // Bước 4: Xóa file ảnh cũ nếu có
          if (oldFilename) {
            const oldFilePath = path.join(__dirname, "uploads", oldFilename);
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                console.warn("Không thể xóa file ảnh cũ:", oldFilePath);
                // Không trả lỗi, vì update vẫn thành công
              }
            });
          }

          return res
            .status(200)
            .json({ message: "Banner đã được cập nhật.", id: bannerId });
        }
      );
    });
  });
});

// API: Thêm sản phẩm kèm ảnh
app.post("/products", upload.single("image"), (req, res) => {
  const { name, description, price, category_id } = req.body;
  const file = req.file;

  if (!name || !price || !category_id || !file) {
    return res
      .status(400)
      .json({ message: "Tên, giá, danh mục và ảnh là bắt buộc!" });
  }

  // Lưu tên file ảnh vào database (chỉ lưu tên file, không phải URL)
  const imageFilename = file.filename; // Chỉ lưu "123456.jpg"
  const created_at = new Date();
  const updated_at = new Date();

  const sql = `
    INSERT INTO products (name, description, price, images, category_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      description,
      price,
      imageFilename,
      category_id,
      created_at,
      updated_at,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi khi thêm sản phẩm" });
      }
      res.status(201).json({
        message: "Sản phẩm đã được thêm!",
        productId: result.insertId,
      });
    }
  );
});

// API: Cập nhật sản phẩm kèm ảnh
app.put("/products/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id } = req.body;
  const file = req.file;

  if (!name || !price || !category_id) {
    return res.status(400).json({ message: "Tên, giá, danh mục là bắt buộc!" });
  }

  let imageFilename = req.body.image; // Giữ lại tên file cũ nếu không cập nhật ảnh mới

  // Nếu có ảnh mới
  if (file) {
    imageFilename = file.filename; // Lưu tên file mới
  }

  const updated_at = new Date();

  const sql = `
    UPDATE products
    SET name = ?, description = ?, price = ?, images = ?, category_id = ?, updated_at = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, description, price, imageFilename, category_id, updated_at, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm" });
      }
      res
        .status(200)
        .json({ message: "Sản phẩm đã được cập nhật!", productId: id });
    }
  );
});

// Cấu hình cho phép Express phục vụ thư mục `uploads`
app.use("/uploads", express.static("uploads"));
// API: Thêm danh mục kèm ảnh
app.post("/categories", upload.single("image"), (req, res) => {
  const { name } = req.body;
  const file = req.file;

  if (!name || !file) {
    return res.status(400).json({ message: "Tên và ảnh là bắt buộc!" });
  }

  // Kiểm tra xem tên danh mục đã tồn tại chưa
  const checkSql = "SELECT id FROM categories WHERE name = ?";
  db.query(checkSql, [name], (err, results) => {
    if (err) {
      console.error("Lỗi khi kiểm tra tên danh mục:", err);
      return res.status(500).json({ message: "Lỗi server khi kiểm tra danh mục." });
    }

    if (results.length > 0) {
      // Tên danh mục đã tồn tại
      return res.status(400).json({ alert: "Tên danh mục đã tồn tại, vui lòng chọn tên khác." });
    }

    // Nếu chưa tồn tại, tiếp tục xử lý lưu ảnh và thêm danh mục mới
    const imageFilename = generateRandomFilename();

    const fs = require("fs");
    const path = require("path");
    const oldPath = path.join(__dirname, "uploads", file.filename);
    const newPath = path.join(__dirname, "uploads", imageFilename);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error("Lỗi khi đổi tên file:", err);
        return res.status(500).json({ message: "Lỗi khi đổi tên file ảnh." });
      }

      const created_at = new Date();
      const sql =
        "INSERT INTO categories (name, images, created_at) VALUES (?, ?, ?)";

      db.query(sql, [name, imageFilename, created_at], (err, results) => {
        if (err) {
          console.error("Lỗi khi thêm danh mục:", err);
          return res.status(500).json({ message: "Lỗi khi thêm danh mục." });
        }
        res.status(201).json({ message: "Danh mục đã được thêm." });
      });
    });
  });
});


/// API UPDATE CATERGORYCATERGORY
// API: Cập nhật danh mục kèm ảnh
app.put("/categories/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Tên là bắt buộc!" });
  }

  const updated_at = new Date();

  const proceedUpdate = (imageFilename) => {
    const sql =
      "UPDATE categories SET name = ?, images = ?, created_at = ? WHERE id = ?";
    db.query(sql, [name, imageFilename, updated_at, id], (err, results) => {
      if (err) {
        console.error("Lỗi khi cập nhật danh mục:", err.message);
        return res.status(500).json({ message: "Lỗi khi cập nhật danh mục." });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Danh mục không tồn tại." });
      }

      res.status(200).json({ message: "Danh mục đã được cập nhật." });
    });
  };

  if (req.file) {
    const imageFilename = generateRandomFilename();

    const fs = require("fs");
    const path = require("path");
    const oldPath = path.join(__dirname, "uploads", req.file.filename);
    const newPath = path.join(__dirname, "uploads", imageFilename);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error("Lỗi khi đổi tên file:", err);
        return res.status(500).json({ message: "Lỗi khi đổi tên file ảnh." });
      }
      proceedUpdate(imageFilename); // Cập nhật DB với ảnh mới
    });
  } else {
    // Không có ảnh mới → truy vấn ảnh cũ từ DB
    const sql = "SELECT images FROM categories WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy ảnh cũ:", err.message);
        return res
          .status(500)
          .json({ message: "Lỗi server khi lấy dữ liệu cũ." });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Danh mục không tồn tại." });
      }

      const imageFilename = results[0].images;
      proceedUpdate(imageFilename); // Cập nhật DB với ảnh cũ
    });
  }
});

//API XOA SAN PHAM
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE products SET role = 0 WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật role sản phẩm:", err.message);
      return res
        .status(500)
        .json({ message: "Lỗi khi cập nhật role sản phẩm." });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm để cập nhật." });
    }

    res
      .status(200)
      .json({ message: "Đã chuyển role sản phẩm thành 0 (ẩn sản phẩm)." });
  });
});

// API XOA DANH MUC
app.delete("/categories/:id", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE categories SET role = 0 WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật role danh mục:", err.message);
      return res
        .status(500)
        .json({ message: "Lỗi khi cập nhật role danh mục." });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh mục để cập nhật." });
    }

    res
      .status(200)
      .json({ message: "Đã chuyển role danh mục thành 0 (ẩn danh mục)." });
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối MySQL:", err);
  } else {
    console.log("Đã kết nối MySQL thành công!");
  }
});

// Test
app.get("/", (req, res) => {
  res.send("Server Node.js đã chạy");
});

// API: Đăng ký người dùng
app.post("/register", (req, res) => {
  const { fullName, username, email, password, phone, address } = req.body;

  if (!fullName || !username || !email || !password || !phone || !address) {
    return res
      .status(400)
      .json({ success: false, alert: "Vui lòng nhập đầy đủ thông tin" });
  }

  console.log("Dữ liệu đăng ký nhận được:", {
    fullName,
    username,
    email,
    password,
    phone,
    address,
    role: 0, // Mặc định role = 0 (member)
  });

  // Kiểm tra username hoặc email có trùng không
  const checkUsernameSql = "SELECT * FROM users WHERE username = ?";
  const checkEmailSql = "SELECT * FROM users WHERE email = ?";

  db.query(checkUsernameSql, [username], (err, usernameResult) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, alert: "Lỗi khi kiểm tra username" });
    if (usernameResult.length > 0)
      return res
        .status(400)
        .json({ success: false, alert: "Tên đăng nhập đã tồn tại" });

    db.query(checkEmailSql, [email], (err, emailResult) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, alert: "Lỗi khi kiểm tra email" });
      if (emailResult.length > 0)
        return res
          .status(400)
          .json({ success: false, alert: "Email đã tồn tại" });

      const insertSql =
        "INSERT INTO users (name, username, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
      db.query(
        insertSql,
        [fullName, username, email, password, phone, address, 0],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, alert: "Lỗi khi đăng ký tài khoản" });

          console.log("Thêm user mới vào database thành công!");
          res.json({ success: true, alert: "Đăng ký thành công" });
        }
      );
    });
  });
});
app.post("/registeradmin", (req, res) => {
  const { fullName, username, email, password, phone, address } = req.body;

  if (!fullName || !username || !email || !password || !phone || !address) {
    return res
      .status(400)
      .json({ success: false, alert: "Vui lòng nhập đầy đủ thông tin" });
  }

  console.log("Dữ liệu đăng ký nhận được:", {
    fullName,
    username,
    email,
    password,
    phone,
    address,
    role: 1, // Mặc định role = 0 (member)
  });

  // Kiểm tra username hoặc email có trùng không
  const checkUsernameSql = "SELECT * FROM users WHERE username = ?";
  const checkEmailSql = "SELECT * FROM users WHERE email = ?";

  db.query(checkUsernameSql, [username], (err, usernameResult) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, alert: "Lỗi khi kiểm tra username" });
    if (usernameResult.length > 0)
      return res
        .status(400)
        .json({ success: false, alert: "Tên đăng nhập đã tồn tại" });

    db.query(checkEmailSql, [email], (err, emailResult) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, alert: "Lỗi khi kiểm tra email" });
      if (emailResult.length > 0)
        return res
          .status(400)
          .json({ success: false, alert: "Email đã tồn tại" });

      const insertSql =
        "INSERT INTO users (name, username, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
      db.query(
        insertSql,
        [fullName, username, email, password, phone, address, 1],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, alert: "Lỗi khi đăng ký tài khoản" });

          console.log("Thêm user mới vào database thành công!");
          res.json({ success: true, alert: "Đăng ký thành công" });
        }
      );
    });
  });
});
// PUT /users/:id
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT * FROM users WHERE id = ? AND role = 1",
      [id]
    );
    if (existing.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản Admin" });
    }

    await db.query(
      "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
      [username, email, password, id]
    );
    res.json({ message: "Cập nhật Admin thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật admin:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi cập nhật admin" });
  }
});

app.delete("/deleteusers/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Nhận yêu cầu xóa tài khoản admin với ID: ${id}`);

  // Kiểm tra xem tài khoản admin có tồn tại hay không
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    if (err) {
      console.error("Lỗi khi truy vấn:", err);
      return res
        .status(500)
        .json({ message: "Lỗi máy chủ khi kiểm tra tài khoản admin" });
    }

    console.log("Kết quả tìm kiếm user:", user);

    if (user.length === 0) {
      console.log("Không tìm thấy tài khoản admin với ID:", id);
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản Admin để xóa" });
    }

    // Tiến hành xóa tài khoản admin
    db.query("DELETE FROM users WHERE id = ? ", [id], (err, result) => {
      if (err) {
        console.error("Lỗi khi xóa admin:", err);
        return res.status(500).json({ message: "Lỗi máy chủ khi xóa admin" });
      }

      console.log("Kết quả xóa tài khoản:", result);

      if (result.affectedRows === 0) {
        console.log("Không thể xóa tài khoản admin với ID:", id);
        return res
          .status(404)
          .json({ message: "Không thể xóa tài khoản Admin này" });
      }

      console.log("Xóa tài khoản Admin thành công với ID:", id);
      res.json({ message: "Xóa tài khoản Admin thành công" });
    });
  });
});

app.put("/updateuser/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, address } = req.body;

  // Kiểm tra dữ liệu nhập vào
  if (!name || !email || !phone || !address) {
    console.log("Missing data:", { name, email, phone, address }); // In ra dữ liệu thiếu
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
  }

  console.log("Received update request for user ID:", userId);
  console.log("Update data:", { name, email, phone, address }); // In ra dữ liệu mà client gửi đến

  // Cập nhật thông tin người dùng trong cơ sở dữ liệu
  const query = `
    UPDATE users
    SET name = ?, email = ?, phone = ?, address = ?
    WHERE id = ?
  `;
  db.query(query, [name, email, phone, address, userId], (err, result) => {
    if (err) {
      console.error("Error updating user info:", err); // In ra lỗi nếu có
      return res
        .status(500)
        .json({ success: false, message: "Không thể cập nhật thông tin" });
    }

    console.log("Query result:", result); // In ra kết quả trả về từ cơ sở dữ liệu

    if (result.affectedRows === 0) {
      console.log("No user found with ID:", userId); // In ra nếu không tìm thấy người dùng
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("User info updated successfully for ID:", userId); // In ra thông báo khi cập nhật thành công
    return res.status(200).json({
      success: true,
      message: "User information updated successfully",
    });
  });
});
app.put("/updateadmin/:id", (req, res) => {
  const adminId = req.params.id;
  const { name, email, phone, address, password, username } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !email || !phone || !address || !username) {
    console.log("Thiếu dữ liệu:", { name, email, phone, address, username });
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
  }

  console.log("Yêu cầu cập nhật admin:", adminId);
  console.log("Dữ liệu nhận được:", {
    name,
    email,
    phone,
    address,
    password,
    username,
  });

  // Nếu có password mới thì cập nhật cả password
  let query = `
    UPDATE users
    SET name = ?, email = ?, phone = ?, address = ?, username = ?
    ${password ? ", password = ?" : ""}
    WHERE id = ?
  `;

  // Chuẩn bị giá trị
  const params = password
    ? [name, email, phone, address, username, password, adminId]
    : [name, email, phone, address, username, adminId];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật thông tin admin:", err);
      return res.status(500).json({
        success: false,
        message: "Không thể cập nhật thông tin admin",
      });
    }

    if (result.affectedRows === 0) {
      console.log("Không tìm thấy admin với ID:", adminId);
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy quản trị viên" });
    }

    console.log("Cập nhật admin thành công ID:", adminId);
    return res
      .status(200)
      .json({ success: true, message: "Cập nhật quản trị viên thành công" });
  });
});

// API: Lấy thông tin người dùng
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const query =
    "SELECT id,username,password, name, email, phone, address FROM users WHERE id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({
        success: false,
        alert: "Có lỗi xảy ra khi truy vấn cơ sở dữ liệu",
      });
    }

    if (results.length > 0) {
      return res.json({ success: true, user: results[0] });
    } else {
      return res
        .status(404)
        .json({ success: false, alert: "Người dùng không tìm thấy" });
    }
  });
});

// API: Đăng nhập người dùng
app.post("/login", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || role === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập đủ thông tin" });
  }

  const sql =
    "SELECT * FROM users WHERE username = ? AND password = ? AND role = ?";
  db.query(sql, [username, password, role], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn:", err);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }

    if (results.length > 0) {
      const user = results[0];
      return res.json({
        success: true,
        message: "Đăng nhập thành công",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Tên đăng nhập, mật khẩu hoặc quyền truy cập không đúng",
      });
    }
  });
});

// API: Lấy danh sách danh mục kèm số lượng sản phẩm
app.get("/categories", (req, res) => {
  const sql = `
    SELECT c.id, c.name, COUNT(p.id) AS product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id, c.name
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn" });
    res.json(result);
  });
});
// API: Lấy danh sách đơn hàng
app.get("/orders", (req, res) => {
  const status = req.query.status || ""; // Lấy trạng thái từ query parameter

  // Truy vấn lấy thông tin đơn hàng, tổng giá trị đơn hàng, tổng số sản phẩm và tên khách hàng
  const sql = `
    SELECT 
      o.id, 
      u.name AS userName, 
      o.status, 
      SUM(od.quantity) AS total_quantity, 
      o.total_amount AS total_price,
      o.created_at AS orderDate
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN order_details od ON o.id = od.order_id
    LEFT JOIN products p ON od.product_id = p.id
    WHERE o.status LIKE ?  -- Sử dụng tham số để tránh SQL injection
    GROUP BY o.id, u.name, o.status
  `;

  // Sử dụng tham số thay vì nối chuỗi trực tiếp để tránh SQL injection
  db.query(sql, [`%${status}%`], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi truy vấn" });
    }

    // In thông tin truy vấn vào console
    console.log("Truy vấn thành công!");
    console.log("Số lượng đơn hàng tìm thấy:", result.length);
    console.log("Dữ liệu đơn hàng:", result);

    // Trả về kết quả dưới dạng JSON
    res.json(result);
  });
});
app.put("/orders/:id/cancel", (req, res) => {
  const orderId = req.params.id;

  const query = "UPDATE orders SET status = ? WHERE id = ?";
  const values = ["Canceled", orderId];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({ message: "Đơn hàng đã được hủy" });
  });
});

app.post("/feedbacks", upload.single("image"), (req, res) => {
  const { orderId, userId, star, feedback: feedbackText } = req.body;
  const file = req.file;

  if (!orderId || !userId || !star) {
    console.log("Thiếu thông tin bắt buộc:", { orderId, userId, star });
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  const imageFilename = file ? file.filename : null;
  console.log("Tên file ảnh được upload:", imageFilename);

  const queryProducts =
    "SELECT productid FROM order_details WHERE order_id = ?";

  db.query(queryProducts, [orderId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy sản phẩm trong đơn hàng:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong đơn hàng" });
    }

    const now = new Date();
    const feedbacksToInsert = results.map((row) => [
      userId,
      row.product_id,
      imageFilename,
      star,
      feedbackText || "",
      now,
    ]);

    const insertQuery = `
      INSERT INTO feedback (userid, productid, images, star, feedback, created_at)
      VALUES ?
    `;

    db.query(insertQuery, [feedbacksToInsert], (insertErr) => {
      if (insertErr) {
        console.error("Lỗi khi lưu phản hồi:", insertErr);
        return res.status(500).json({ message: "Lỗi khi lưu phản hồi" });
      }
      res.status(201).json({
        message: "Phản hồi đã được ghi nhận cho tất cả sản phẩm trong đơn hàng",
      });
    });
  });
});
app.post("/saveSearch", (req, res) => {
  const { userId, searchContent } = req.body;

  if (!userId || !searchContent) {
    return res.status(400).json({ message: "Thiếu userId hoặc searchContent" });
  }

  const query = "INSERT INTO search (userId, searchContent) VALUES (?, ?)";
  db.query(query, [userId, searchContent], (err, results) => {
    if (err) {
      console.error("Lỗi khi lưu tìm kiếm:", err);
      return res.status(500).json({ message: "Lỗi server khi lưu tìm kiếm" });
    }
    res.json({
      message: "Lưu tìm kiếm thành công",
      insertId: results.insertId,
    });
  });
});
app.get("/topSearches", (req, res) => {
  const userId = req.query.userId;
  const limit = parseInt(req.query.limit) || 5;

  if (!userId) {
    // Nếu không có userId thì trả về mảng rỗng luôn
    return res.json([]);
  }

  const sql = `SELECT searchContent FROM search WHERE userId = ? ORDER BY id DESC LIMIT ?`;

  db.query(sql, [userId, limit], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    const keywords = results.map((row) => row.searchContent);
    res.json(keywords);
  });
});

app.get("/feedbacks/product/:productId", (req, res) => {
  const productId = req.params.productId;

  db.query(
    "SELECT f.feedback, f.star,f.images, u.name FROM feedback f JOIN users u ON f.userid = u.id WHERE f.productid = ?",
    [productId],
    (error, results) => {
      if (error) {
        console.error("Lỗi lấy feedback:", error);
        return res.status(500).json({ error: "Lỗi server" });
      }

      // Trả về mảng feedback
      res.json(results);
    }
  );
});

// Cập nhật trạng thái đơn hàng
app.put("/orders/:id/status", (req, res) => {
  const orderId = req.params.id;

  const query = "UPDATE orders SET status = ? WHERE id = ?";
  const values = ["Delivered", orderId];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res
      .status(200)
      .json({ message: "Đã cập nhật trạng thái đơn hàng thành Delivered" });
  });
});
app.get("/orders/:orderId/detail", (req, res) => {
  const { orderId } = req.params;

  // Lấy thông tin đơn hàng từ bảng orders, kết hợp với bảng users để lấy tên người dùng
  db.query(
    `SELECT o.id, o.created_at AS order_date,o.total_amount AS total_price, o.status, u.name AS user_name 
     FROM orders o
     JOIN users u ON o.user_id = u.id
     WHERE o.id = ?`,
    [orderId],
    (error, order) => {
      if (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        return res
          .status(500)
          .json({ message: "Lỗi server khi lấy thông tin đơn hàng" });
      }

      if (!order || order.length === 0) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại" });
      }

      // Lấy chi tiết các sản phẩm trong đơn hàng từ bảng order_details và kết hợp với bảng products để lấy tên sản phẩm
      db.query(
        `SELECT od.product_id, p.name AS product_name, od.quantity, od.price
         FROM order_details od
         JOIN products p ON od.product_id = p.id
         WHERE od.order_id = ?`,
        [orderId],
        (error, orderDetails) => {
          if (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            return res
              .status(500)
              .json({ message: "Lỗi server khi lấy chi tiết đơn hàng" });
          }

          // Tính tổng giá từ các sản phẩm trong đơn hàng
          const totalPrice = order[0].total_price;

          // Console log thông tin đơn hàng và chi tiết
          console.log("Thông tin đơn hàng:", order);
          console.log("Chi tiết sản phẩm trong đơn hàng:", orderDetails);

          // Trả về kết quả cho người dùng
          return res.json({
            order: {
              id: order[0].id,
              userName: order[0].user_name, // Tên người dùng
              orderDate: order[0].order_date,
              totalPrice: totalPrice, // Tính tổng giá từ orderDetails
              status: order[0].status,
            },
            orderDetails,
          });
        }
      );
    }
  );
});

// API: Lấy danh sách đơn hàng của người dùng
app.get("/orders/user/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT o.id, o.status, o.total_amount, o.payment_type, o.created_at
    FROM orders o
    WHERE o.user_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err); // Log lỗi chi tiết
      return res.status(500).json({ error: "Lỗi truy vấn đơn hàng" });
    }
    res.json(results);
  });
});

// API: Lấy chi tiết đơn hàng (sản phẩm trong đơn hàng)
app.get("/order/:orderId", (req, res) => {
  const orderId = req.params.orderId;

  const sqlOrderInfo = `
    SELECT status, total_amount, payment_type, created_at
    FROM orders
    WHERE id = ?
  `;

  const sqlOrderDetails = `
    SELECT od.id, p.name, p.price, od.quantity
    FROM order_details od
    JOIN products p ON od.product_id = p.id
    WHERE od.order_id = ?
  `;

  db.query(sqlOrderInfo, [orderId], (err, orderResult) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn đơn hàng" });
    if (orderResult.length === 0)
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });

    const orderInfo = orderResult[0];

    db.query(sqlOrderDetails, [orderId], (err, itemResults) => {
      if (err) return res.status(500).json({ error: "Lỗi truy vấn sản phẩm" });

      res.json({
        orderInfo,
        items: itemResults,
      });
    });
  });
});

app.get("/listcategories", (req, res) => {
  const sql = `SELECT * FROM categories WHERE role = 1`;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn danh mục" });

    res.json(result);
  });
});

app.get("/products-by-category/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.images, p.category_id, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = ?
  `;
  db.query(sql, [categoryId], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn sản phẩm" });
    res.json(result);
  });
});
app.delete("/order-detail/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Thiếu ID sản phẩm" });
  }

  // Bước 1: Lấy order_id từ sản phẩm cần xóa
  const getOrderIdQuery = "SELECT order_id FROM order_details WHERE id = ?";
  db.execute(getOrderIdQuery, [id], (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi truy vấn order_id:", err);
      return res.status(500).json({ message: "Lỗi truy vấn order_id" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm để xóa" });
    }

    const orderId = results[0].order_id;
    console.log("📌 order_id lấy được trước khi xóa:", orderId);

    // Bước 2: Xóa sản phẩm khỏi order_details
    const deleteQuery = "DELETE FROM order_details WHERE id = ?";
    db.execute(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error("❌ Lỗi khi xóa sản phẩm:", err);
        return res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
      }

      console.log(
        `🗑️ Đã xóa sản phẩm có id = ${id}, affectedRows = ${result.affectedRows}`
      );

      // Bước 3: Tính lại tổng tiền đơn hàng, áp dụng discount riêng từng dòng
      const totalQuery = `
        SELECT SUM(price * (1 - IFNULL(discount, 0) / 100)) AS total
        FROM order_details
        WHERE order_id = ?
      `;
      db.execute(totalQuery, [orderId], (err, rows) => {
        if (err) {
          console.error("❌ Lỗi khi tính tổng:", err);
          return res.status(500).json({ message: "Lỗi khi tính tổng tiền" });
        }

        const newTotal = Math.round(rows[0].total || 0);
        console.log(
          `💰 Tổng tiền mới của đơn hàng ${orderId} là: ${newTotal}₫`
        );

        if (newTotal === 0) {
          // Bước 4a: Xóa đơn hàng nếu không còn sản phẩm
          const deleteOrderQuery = "DELETE FROM orders WHERE id = ?";
          db.execute(deleteOrderQuery, [orderId], (err, result) => {
            if (err) {
              console.error("❌ Lỗi khi xóa đơn hàng:", err);
              return res.status(500).json({ message: "Lỗi khi xóa đơn hàng" });
            }

            console.log(`🗑️ Đã xóa đơn hàng ${orderId} vì không còn sản phẩm`);
            return res.status(200).json({
              message: "Đã xóa sản phẩm và đơn hàng vì không còn sản phẩm nào",
            });
          });
        } else {
          // Bước 4b: Cập nhật lại đơn hàng nếu vẫn còn sản phẩm
          const updateOrderQuery =
            "UPDATE orders SET total_amount = ? WHERE id = ?";
          db.execute(updateOrderQuery, [newTotal, orderId], (err, result) => {
            if (err) {
              console.error("❌ Lỗi khi cập nhật đơn hàng:", err);
              return res
                .status(500)
                .json({ message: "Lỗi khi cập nhật đơn hàng" });
            }

            console.log(
              `✅ Cập nhật đơn hàng ${orderId} với tổng tiền mới: ${newTotal}₫`
            );
            return res.status(200).json({
              message: "Đã xóa sản phẩm và cập nhật tổng tiền đơn hàng",
            });
          });
        }
      });
    });
  });
});

// API: Lấy danh sách sản phẩm
app.get("/products", (req, res) => {
  const categoryId = req.query.category_id;
  let sql = `
    SELECT p.id, p.name, p.description, p.price, p.images, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.role = 1
  `;

  if (categoryId) {
    sql += ` AND p.category_id = ?`;
    db.query(sql, [categoryId], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi truy vấn" });
      res.json(result);
    });
  } else {
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi truy vấn" });
      res.json(result);
    });
  }
});

// API: Lấy chi tiết sản phẩm theo ID
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const sqlQuery = "SELECT * FROM products WHERE id = ?";

  db.query(sqlQuery, [productId], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi hệ thống" });
    if (results.length === 0)
      return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
    res.json(results[0]);
  });
});

// API: Lấy danh sách giỏ hàng của người dùng
app.get("/cart/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT c.id AS cart_id, p.id AS product_id,p.description, p.name, p.price, ci.quantity, p.images
    FROM carts c
    JOIN cart_items ci ON c.id = ci.cart_id
    JOIN products p ON ci.product_id = p.id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn giỏ hàng" });
    res.json(results);
  });
});

// API: Thêm sản phẩm vào giỏ hàng (có tự động tạo giỏ nếu chưa có)
app.post("/cart-items", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  const checkCartQuery = "SELECT id FROM carts WHERE user_id = ?";
  db.query(checkCartQuery, [user_id], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Lỗi khi kiểm tra giỏ hàng" });

    // Nếu giỏ hàng đã tồn tại
    if (results.length > 0) {
      const cart_id = results[0].id;

      // Kiểm tra sản phẩm trong giỏ hàng
      const checkItemQuery =
        "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?";
      db.query(checkItemQuery, [cart_id, product_id], (err, results) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Lỗi kiểm tra sản phẩm trong giỏ hàng" });

        // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        if (results.length > 0) {
          const updateQuery =
            "UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?";
          db.query(updateQuery, [quantity, cart_id, product_id], (err) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Lỗi khi cập nhật giỏ hàng" });
            res.status(200).json({ message: "Cập nhật giỏ hàng thành công" });
          });
        } else {
          // Nếu chưa có, thêm sản phẩm vào giỏ
          const insertQuery =
            "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)";
          db.query(insertQuery, [cart_id, product_id, quantity], (err) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Lỗi khi thêm sản phẩm vào giỏ hàng" });
            res
              .status(200)
              .json({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
          });
        }
      });
    } else {
      // Nếu chưa có giỏ hàng, tạo mới giỏ hàng và thêm sản phẩm
      const createCartQuery = "INSERT INTO carts (user_id) VALUES (?)";
      db.query(createCartQuery, [user_id], (err, result) => {
        if (err)
          return res.status(500).json({ message: "Lỗi khi tạo giỏ hàng" });

        const cart_id = result.insertId;
        const insertItemQuery =
          "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)";
        db.query(insertItemQuery, [cart_id, product_id, quantity], (err) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Lỗi khi thêm sản phẩm vào giỏ hàng" });
          res
            .status(200)
            .json({ message: "Tạo giỏ hàng và thêm sản phẩm thành công" });
        });
      });
    }
  });
});
// API: Đặt hàng
app.post("/place-order", (req, res) => {
  const { userId, paymentType, totalAmount, voucherCode } = req.body;

  console.log("userId:", userId);
  console.log("paymentType:", paymentType);
  console.log("totalAmount:", totalAmount);
  console.log("voucherCode:", voucherCode);

  if (!userId || !paymentType || !totalAmount) {
    return res
      .status(400)
      .json({ success: false, alert: "Dữ liệu không hợp lệ" });
  }

  const handleError = (err, message) => {
    console.error(err);
    res.status(500).json({ success: false, alert: message });
  };

  const now = new Date();
  let appliedDiscount = 0; // Mặc định không có mã giảm giá

  const processVoucher = (callback) => {
    if (!voucherCode) return callback(); // Không có mã thì tiếp tục luôn

    const voucherQuery = `
      SELECT * FROM vouchers 
      WHERE discountcode = ? AND start <= ? AND end >= ? AND quantity > 0
    `;

    db.query(voucherQuery, [voucherCode, now, now], (err, result) => {
      if (err) return handleError(err, "Lỗi kiểm tra mã giảm giá");

      if (result.length === 0) {
        return res.status(400).json({
          success: false,
          alert: "Mã giảm giá không hợp lệ hoặc đã hết lượt sử dụng",
        });
      }

      appliedDiscount = result[0].discount || 0;

      // Giảm quantity voucher
      db.query(
        "UPDATE vouchers SET quantity = quantity - 1 WHERE id = ?",
        [result[0].id],
        (err2) => {
          if (err2) return handleError(err2, "Lỗi cập nhật mã giảm giá");
          callback(); // Tiếp tục
        }
      );
    });
  };

  processVoucher(() => {
    // Tạo đơn hàng
    const createOrderQuery = `
      INSERT INTO orders (user_id, status, payment_type, total_amount)
      VALUES (?, ?, ?, ?)
    `;
    db.query(
      createOrderQuery,
      [userId, "Ordered", paymentType, totalAmount],
      (err) => {
        if (err) return handleError(err, "Lỗi khi tạo đơn hàng");

        // Lấy giỏ hàng
        const cartQuery = `
          SELECT ci.product_id, ci.quantity, p.price
          FROM cart_items ci
          JOIN products p ON ci.product_id = p.id
          WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = ? LIMIT 1)
        `;
        db.query(cartQuery, [userId], (err2, cartItems) => {
          if (err2) return handleError(err2, "Lỗi khi lấy giỏ hàng");

          if (cartItems.length === 0) {
            return res.status(400).json({
              success: false,
              alert: "Giỏ hàng của bạn trống",
            });
          }

          // Lấy ID của đơn hàng vừa tạo
          db.query(
            "SELECT LAST_INSERT_ID() AS orderId",
            (err3, orderResult) => {
              if (err3) return handleError(err3, "Lỗi khi lấy orderId");

              const orderId = orderResult[0].orderId;
              let remaining = cartItems.length;

              cartItems.forEach((item) => {
                const total = item.price * item.quantity;

                const insertQuery = `
                INSERT INTO order_details (order_id, product_id, quantity, price, discount)
                VALUES (?, ?, ?, ?, ?)
              `;
                db.query(
                  insertQuery,
                  [
                    orderId,
                    item.product_id,
                    item.quantity,
                    total,
                    appliedDiscount,
                  ],
                  (err4) => {
                    if (err4)
                      return handleError(
                        err4,
                        "Lỗi khi thêm sản phẩm vào đơn hàng"
                      );

                    remaining--;
                    if (remaining === 0) {
                      // Xóa giỏ hàng sau khi thêm tất cả sản phẩm
                      db.query(
                        "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
                        [userId],
                        (err5, cart) => {
                          if (err5)
                            return handleError(err5, "Lỗi khi lấy cart");

                          if (cart.length > 0) {
                            db.query(
                              "DELETE FROM cart_items WHERE cart_id = ?",
                              [cart[0].id],
                              (err6) => {
                                if (err6)
                                  return handleError(
                                    err6,
                                    "Lỗi khi xóa giỏ hàng"
                                  );
                                res.status(200).json({
                                  success: true,
                                  alert: "Đặt hàng thành công",
                                });
                              }
                            );
                          } else {
                            res.status(200).json({
                              success: true,
                              alert: "Đặt hàng thành công",
                            });
                          }
                        }
                      );
                    }
                  }
                );
              });
            }
          );
        });
      }
    );
  });
});

app.get("/users", (req, res) => {
  const role = req.query.role; // Lấy giá trị role từ query string

  if (role) {
    const query = "SELECT id, username, email, role FROM users WHERE role = ?";
    db.query(query, [role], (err, results) => {
      if (err) {
        console.error("Lỗi khi truy vấn cơ sở dữ liệu:", err);
        return res.status(500).send("Lỗi server");
      }

      // Trả về kết quả tìm được
      res.json(results);
    });
  } else {
    res.status(400).send("Thiếu tham số role");
  }
});
// app.js (hoặc server.js)

app.get("/top-products/:limit", (req, res) => {
  const limit = parseInt(req.params.limit);

  if (isNaN(limit) || limit <= 0) {
    return res.status(400).json({ message: "Số lượng không hợp lệ" });
  }

  const sql = `
    SELECT p.id, p.name, SUM(od.quantity) AS total_sold
    FROM order_details od
    JOIN products p ON od.product_id = p.id
    GROUP BY p.id, p.name
    ORDER BY total_sold DESC
    LIMIT ?
  `;

  db.query(sql, [limit], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ message: "Lỗi truy vấn" });
    }
    res.json(result);
  });
});
app.get("/revenue-report", (req, res) => {
  console.log("API request received for revenue report");

  // Truy vấn dữ liệu doanh thu của ba tháng gần nhất
  const query = `
    SELECT 
        YEAR(o.created_at) AS year,
        MONTH(o.created_at) AS month,
        SUM(od.quantity * od.price) AS total_revenue, 
        SUM(od.quantity) AS total_sold_products
    FROM 
        order_details od
    JOIN 
        orders o ON od.order_id = o.id
    WHERE 
        o.status = 'Delivered' 
        AND o.created_at >= NOW() - INTERVAL 3 MONTH
    GROUP BY 
        YEAR(o.created_at), MONTH(o.created_at)
    ORDER BY 
        YEAR(o.created_at) DESC, MONTH(o.created_at) DESC;
  `;

  // Thực hiện truy vấn
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send("Database query error");
    } else {
      console.log("Query result:", results);
      res.json(results);
    }
  });
});
//Lấy yêu thích
app.get("/favourite/:userId", (req, res) => {
  const { userId } = req.params;
  console.log("📥 Lấy danh sách yêu thích của user:", userId);

  const sql = `
    SELECT f.*, p.name, p.price, p.images
    FROM favorites f
    JOIN products p ON f.productid = p.id
    WHERE f.userid = ?
  `;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("❌ Lỗi truy vấn favorites:", err);
      return res.status(500).json({ error: "Lỗi truy vấn" });
    }
    console.log("✅ Kết quả yêu thích:", result);
    res.json(result);
  });
});
//Thêm Yêu Thích
app.post("/favorites", (req, res) => {
  const { user_id, product_id } = req.body;
  console.log("📥 Thêm yêu thích:", { user_id, product_id });

  if (!user_id || !product_id) {
    console.warn("⚠️ Thiếu user_id hoặc product_id");
    return res.status(400).json({ error: "Thiếu userid hoặc productid" });
  }

  const sql =
    "INSERT INTO favorites (userid, productid, created_at) VALUES (?, ?, NOW())";
  db.query(sql, [user_id, product_id], (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi thêm vào favorites:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Đã tồn tại trong yêu thích" });
      }
      return res.status(500).json({ error: "Lỗi khi thêm vào yêu thích" });
    }

    console.log("✅ Đã thêm vào favorites với ID:", result.insertId);
    res.json({ message: "Đã thêm vào yêu thích", id: result.insertId });
  });
});
//Xóa Yêu Thích
app.delete("/favorites", (req, res) => {
  const { user_id, product_id } = req.body;
  console.log("🗑️ Xóa yêu thích:", { user_id, product_id });

  if (!user_id || !product_id) {
    console.warn("⚠️ Thiếu user_id hoặc product_id");
    return res.status(400).json({ error: "Thiếu userid hoặc productid" });
  }

  const sql = "DELETE FROM favorites WHERE userid = ? AND productid = ?";
  db.query(sql, [user_id, product_id], (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi xóa yêu thích:", err);
      return res.status(500).json({ error: "Lỗi khi xóa khỏi yêu thích" });
    }

    if (result.affectedRows === 0) {
      console.log("ℹ️ Không tìm thấy bản ghi để xóa");
      return res.status(404).json({ message: "Không tìm thấy mục yêu thích" });
    }

    console.log("✅ Đã xóa yêu thích");
    res.json({ message: "Đã xóa khỏi yêu thích" });
  });
});
// DELETE /cart/:cartId
app.delete("/cart1", (req, res) => {
  const { cart_id, product_id } = req.body;

  if (!cart_id) {
    return res.status(400).json({ message: "cart_id is required" });
  }

  if (!product_id) {
    return res.status(400).json({ message: "product_id is required" });
  }

  // Bước 1: Xóa sản phẩm khỏi bảng cart_items
  const deleteItemSql =
    "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?";
  db.query(deleteItemSql, [cart_id, product_id], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa sản phẩm khỏi cart_items:", err);
      return res
        .status(500)
        .json({ message: "Lỗi máy chủ khi xóa sản phẩm khỏi giỏ hàng" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
    }

    console.log(`Đã xóa product_id=${product_id} khỏi cart_id=${cart_id}`);

    // Bước 2: Kiểm tra nếu giỏ hàng không còn sản phẩm nào thì xóa luôn cart
    const checkCartSql = "SELECT 1 FROM cart_items WHERE cart_id = ? LIMIT 1";
    db.query(checkCartSql, [cart_id], (err, rows) => {
      if (err) {
        console.error("Lỗi khi kiểm tra số lượng sản phẩm trong cart:", err);
        return res.status(500).json({ message: "Lỗi khi kiểm tra giỏ hàng" });
      }

      if (rows.length === 0) {
        // Không còn sản phẩm nào, xóa luôn cart
        const deleteCartSql = "DELETE FROM carts WHERE id = ?";
        db.query(deleteCartSql, [cart_id], (err, result) => {
          if (err) {
            console.error("Lỗi khi xóa cart:", err);
            return res.status(500).json({ message: "Lỗi khi xóa giỏ hàng" });
          }

          console.log(`Đã xóa cart_id=${cart_id} vì không còn sản phẩm nào.`);
          return res.status(200).json({
            message: "Xóa sản phẩm thành công và giỏ hàng rỗng đã bị xóa.",
          });
        });
      } else {
        return res.status(200).json({ message: "Xóa sản phẩm thành công" });
      }
    });
  });
});

// ✅ GET all vouchers
app.get("/vouchers", (req, res) => {
  const sql =
    "SELECT id, start, end, discountcode,discount, quantity, created_at FROM vouchers ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err)
      return res.json({
        success: false,
        message: "Error fetching vouchers",
        error: err,
      });
    res.json({ success: true, vouchers: result });
  });
});

// ✅ Tạo voucher
app.post("/vouchers", (req, res) => {
  const { start, end, discountcode, quantity } = req.body;
  const sql =
    "INSERT INTO vouchers (start, end, discountcode, quantity) VALUES (?, ?, ?, ?)";
  db.query(sql, [start, end, discountcode, quantity], (err, result) => {
    if (err)
      return res.json({ success: false, message: "Insert failed", error: err });
    res.json({ success: true, message: "Voucher created" });
  });
});
//ktra còn hiêu luc
app.get("/available-vouchers", (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const userId = req.query.userId;

  console.log("Nhận request /available-vouchers");
  console.log("🔹 userId:", userId);
  console.log("🔹 today:", today);

  const query = `
    SELECT discountcode AS code, discount, start, end
    FROM vouchers
    WHERE start <= ? AND end >= ? AND quantity > 0
  `;

  db.query(query, [today, today], (err, results) => {
    if (err) {
      console.error("❌ Lỗi truy vấn vouchers:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    const result = results.map((row) => ({
      code: row.code,
      description: `Áp dụng từ ${row.start} đến ${row.end}`,
      discountAmount: Number(row.discount) || 0, // Ép kiểu số và fallback 0
    }));

    res.json(result);
  });
});
// Lấy list voucher,loc theo trang tháithái
app.get("/listvouchers", (req, res) => {
  const status = req.query.status || "all";
  const now = new Date();

  let query = "SELECT * FROM vouchers";
  let params = [];

  if (status === "active") {
    query += " WHERE start <= ? AND end >= ? AND quantity > 0";
    params = [now, now];
  } else if (status === "expired") {
    query += " WHERE end < ? OR quantity = 0";
    params = [now];
  }

  db.execute(query, params, (err, rows) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ error: "Lỗi truy vấn voucher" });
    }

    // Chuyển đổi ngày tháng đúng múi giờ VN
    const vouchers = rows.map((voucher) => ({
      ...voucher,
      start: moment(voucher.start).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD"),
      end: moment(voucher.end).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD"),
      created_at: moment(voucher.created_at)
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.json(vouchers);
  });
});

//Tạo Voucher day dudu
app.post("/addvouchers", (req, res) => {
  const { discountcode, discount, start, end, quantity } = req.body;

  if (!discountcode || !discount || !start || !end || !quantity) {
    return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
  }

  // Chuyển start thành ngày đầu ngày (00:00:00) theo định dạng MySQL chuẩn
  const startDate = moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss");

  // Có thể cũng xử lý end tương tự nếu muốn (hoặc giữ nguyên nếu có giờ phút)
  const endDate = moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss");

  const created = moment().format("YYYY-MM-DD HH:mm:ss"); // thời gian tạo voucher

  // Kiểm tra voucher trùng
  db.query(
    "SELECT * FROM vouchers WHERE discountcode = ?",
    [discountcode],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Lỗi máy chủ khi kiểm tra voucher" });
      }

      if (rows.length > 0) {
        return res.status(400).json({ message: "Mã voucher đã tồn tại" });
      }

      // Thêm voucher mới
      const sql = `INSERT INTO vouchers (discountcode, discount, start, end, created_at, quantity)
                   VALUES (?, ?, ?, ?, ?, ?)`;

      db.query(
        sql,
        [discountcode, discount, startDate, endDate, created, quantity],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res
              .status(500)
              .json({ message: "Lỗi máy chủ khi thêm voucher" });
          }

          res.status(201).json({ message: "Thêm voucher thành công" });
        }
      );
    }
  );
});

app.get("/laybanners", (req, res) => {
  db.query(
    "SELECT id, images, created_at FROM banner ORDER BY created_at DESC",
    (error, results) => {
      if (error) {
        console.error("Error fetching banner:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json(results);
    }
  );
});
app.get("/order-info", (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Thiếu userId" });
  }

  // Lấy thông tin người dùng
  const userQuery = `SELECT name, address, phone FROM users WHERE id = ?`;
  db.query(userQuery, [userId], (err, userResult) => {
    if (err)
      return res.status(500).json({ message: "Lỗi khi truy vấn người dùng" });
    if (userResult.length === 0)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const user = userResult[0];

    // Lấy sản phẩm trong giỏ hàng của người dùng
    const productQuery = `
      SELECT p.name, p.description, p.price, p.images, ci.quantity
      FROM carts c
      JOIN cart_items ci ON ci.cart_id = c.id
      JOIN products p ON p.id = ci.product_id
      WHERE c.user_id = ?
    `;

    db.query(productQuery, [userId], (err, products) => {
      if (err)
        return res.status(500).json({ message: "Lỗi khi truy vấn giỏ hàng" });

      res.json({
        user,
        products,
      });
    });
  });
});
app.put("/cart", (req, res) => {
  const { cart_id, product_id, quantity } = req.body;

  console.log("Received update request:", { cart_id, product_id, quantity });

  if (!cart_id || !product_id || quantity < 1) {
    console.log("Invalid data received");
    return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
  }

  const sql = `UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?`;
  console.log("Executing SQL:", sql);

  db.query(sql, [quantity, cart_id, product_id], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật giỏ hàng:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    console.log("Update result:", result);

    if (result.affectedRows === 0) {
      console.log("No rows affected - item not found in cart");
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }

    console.log("Quantity updated successfully");
    res.json({ message: "Cập nhật số lượng thành công" });
  });
});
//Lấy conversation
app.get("/api/conversations/user/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT id, user_id 
    FROM conversations 
    WHERE user_id = ? 
    ORDER BY id DESC
    LIMIT 10
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
});
app.get("/api/conversations1", (req, res) => {
  const sql = "SELECT * FROM conversations";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn conversations:", err);
      return res
        .status(500)
        .json({ error: "Lỗi server khi lấy conversations" });
    }
    res.json(results); // trả về danh sách conversations dưới dạng JSON
  });
});
app.post("/api/conversations", (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "Missing user_id" });

  // Bước 1: Xóa cuộc trò chuyện cũ của user nếu có
  db.query("DELETE FROM conversations WHERE user_id = ?", [user_id], (err) => {
    if (err) {
      console.error("Lỗi khi xóa conversation cũ:", err);
      return res.status(500).json({ error: "Server error" });
    }

    // Bước 2: Tạo conversation mới
    db.query(
      "INSERT INTO conversations (user_id) VALUES (?)",
      [user_id],
      (err2, result) => {
        if (err2) {
          console.error("Lỗi khi tạo conversation mới:", err2);
          return res.status(500).json({ error: "Server error" });
        }

        const newConversationId = result.insertId;

        // Bước 3: Thêm tin nhắn chào mừng từ admin
        const welcomeMessage =
          "Xin chào bạn! Cảm ơn bạn đã liên hệ với NineMart – bạn cần hỗ trợ gì hôm nay ạ? 💬";
        const adminId = 1;
        const role = 1;

        db.query(
          "INSERT INTO messages (conversation_id, user_id, message, role, created_at) VALUES (?, ?, ?, ?, NOW())",
          [newConversationId, adminId, welcomeMessage, role],
          (err3) => {
            if (err3) {
              console.error("Lỗi khi tạo tin nhắn chào mừng:", err3);
              return res.status(500).json({ error: "Server error" });
            }

            // Bước 4: Lấy lại conversation vừa tạo
            db.query(
              "SELECT * FROM conversations WHERE id = ?",
              [newConversationId],
              (err4, rows) => {
                if (err4) {
                  console.error(err4);
                  return res.status(500).json({ error: "Server error" });
                }
                res.json(rows[0]);
              }
            );
          }
        );
      }
    );
  });
});

// Lấy danh sách conversation của user
app.get("/api/conversations/user/:user_id", (req, res) => {
  const userId = +req.params.user_id;
  db.query(
    "SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }
      res.json(rows);
    }
  );
});

// Lấy tin nhắn theo conversation_id
app.get("/api/messages/:conversation_id", (req, res) => {
  const conversationId = +req.params.conversation_id;
  db.query(
    `SELECT m.*, u.name, u.role FROM messages m
     JOIN users u ON m.user_id = u.id
     WHERE m.conversation_id = ?
     ORDER BY m.created_at ASC`,
    [conversationId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }
      res.json(rows);
    }
  );
});

// Gửi tin nhắn
app.post("/api/messages", (req, res) => {
  const { conversation_id, user_id, message } = req.body;
  if (!conversation_id || !user_id || !message)
    return res.status(400).json({ error: "Missing fields" });

  db.query(
    "INSERT INTO messages (conversation_id, user_id, message, created_at) VALUES (?, ?, ?, NOW())",
    [conversation_id, user_id, message],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }
      res.json({ success: true });
    }
  );
});
//Lấy tin nhắn admin
app.get("/api/messagesadmin/:conversationId", (req, res) => {
  const conversationId = req.params.conversationId;

  const sql = `
    SELECT 
      m.id, 
      m.conversation_id, 
      m.message, 
      m.created_at, 
      m.role,
      u.name
    FROM messages m
    LEFT JOIN users u ON m.user_id = u.id
    WHERE m.conversation_id = ?
    ORDER BY m.created_at ASC
  `;

  db.query(sql, [conversationId], (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy tin nhắn:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    // Thêm cờ xác định admin
    const messages = result.map((row) => ({
      id: row.id,
      conversation_id: row.conversation_id,
      message: row.message,
      created_at: row.created_at,
      role: row.role,
      name: row.name,
      is_admin: row.role === 1,
    }));

    res.json(messages);
  });
});

// POST gửi tin nhắn admin
app.post("/api/messagesadmin", (req, res) => {
  const { conversation_id, user_id, message, role } = req.body;

  // Validate dữ liệu đầu vào
  if (
    conversation_id === undefined ||
    user_id === undefined ||
    !message ||
    (role !== 0 && role !== 1)
  ) {
    return res.status(400).json({ message: "Thiếu hoặc sai dữ liệu đầu vào" });
  }

  const sql = `
    INSERT INTO messages (conversation_id, user_id, message, role, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(sql, [conversation_id, user_id, message, role], (err, result) => {
    if (err) {
      console.error("Error inserting message:", err);
      return res.status(500).json({ message: "Lỗi khi gửi tin nhắn" });
    }

    res
      .status(201)
      .json({ message: "Tin nhắn đã được gửi", id: result.insertId });
  });
});
app.get("/checkusers/:id", (req, res) => {
  const userId = req.params.id;
  console.log("Nhận request check role cho userId:", userId);

  const query = "SELECT role FROM users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    console.log("Kết quả truy vấn role:", results);

    if (results.length === 0) {
      console.log("Không tìm thấy user với id:", userId);
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    console.log(`Role của userId ${userId} là:`, results[0].role);
    res.json({ role: results[0].role });
  });
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
