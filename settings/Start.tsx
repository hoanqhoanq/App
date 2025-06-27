import React, { useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { BASE_URL } from "../ipConfig";

// Định nghĩa kiểu Navigation
type NavigationProp = StackNavigationProp<RootStackParamList>;

const Start = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    console.log("🚀 Start screen mounted");

    AsyncStorage.getItem("userId")
      .then((userId) => {
        console.log("🔑 Lấy userId từ AsyncStorage:", userId);

        if (!userId) {
          console.log("❌ Không có userId, chuyển đến Trang Đăng Nhập");
          navigation.reset({ index: 0, routes: [{ name: "Trang Chủ" }] });
          return;
        }

        fetch(`${BASE_URL}/checkusers/${userId}`)
          .then((response) => {
            console.log("🌐 Gọi API lấy thông tin user:", response.status);
            return response.json();
          })
          .then((result) => {
            console.log("📥 Kết quả từ API:", result);

            if (result && result.role !== undefined) {
              if (Number(result.role) === 1) {
                console.log("👑 Là Admin, chuyển đến Trang Chủ Admin");
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Trang Chủ Admin" }],
                });
              } else {
                console.log("🙋‍♂️ Là User, chuyển đến Trang Chủ");
                navigation.reset({ index: 0, routes: [{ name: "Trang Chủ" }] });
              }
            } else {
              console.log("⚠️ Không xác định được vai trò người dùng");
              Alert.alert("Lỗi", "Không xác định được vai trò người dùng.");
              navigation.reset({
                index: 0,
                routes: [{ name: "Trang Chủ" }],
              });
            }
          })
          .catch((error) => {
            console.error("❌ Lỗi khi gọi API:", error);
            Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
            navigation.reset({
              index: 0,
              routes: [{ name: "Trang Chủ" }],
            });
          });
      })
      .catch((error) => {
        console.error("❌ Lỗi khi lấy userId từ AsyncStorage:", error);
        Alert.alert("Lỗi", "Không thể lấy thông tin người dùng.");
        navigation.reset({ index: 0, routes: [{ name: "Trang Chủ" }] });
      });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#00aaff" />
    </View>
  );
};

export default Start;
