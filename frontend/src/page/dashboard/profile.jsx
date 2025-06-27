import { useRef, useState } from "react";
import { Button, Avatar, Input, Modal, Form, Spin, message } from "antd";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiFillLinkedin,
  AiFillGithub,
  AiFillTwitterCircle,
  AiFillFacebook,
  AiOutlineGlobal,
} from "react-icons/ai";
import useUserStore from "../../store/user";
import userAPI from "../../apiManger/user";

const Profile = () => {
  const { setUser, user } = useUserStore();
  const inputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("photo", file);

      try {
        const response = await userAPI.uploadImage(formData);
        setUser({ ...user, photoUrl: response.data.photoUrl });
        message.success("Profile photo updated!");
      } catch (error) {
        console.error("Image upload error:", error);
        message.error("Image upload failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (values) => {
    const updatedUserData = {
      name: values.name,
      email: values.email,
      profile: {
        title: values.title,
        tags: values.skills.split(",").map((tag) => tag.trim()),
        bio: values.bio,
        college: values.college,
        socialLinks: {
          linkedin: values.social?.linkedin || "",
          github: values.social?.github || "",
          Twitter: values.social?.twitter || "",
          facebook: values.social?.facebook || "",
          website: values.social?.website || "",
        },
      },
    };

    try {
      setLoading(true);
      const response = await userAPI.updateUser(updatedUserData);
      setUser(response?.data.user);
      message.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-10 bg-gray-100">
        <h2 className="mb-10 text-5xl font-bold text-center text-blue-800">
          My Profile
        </h2>
        <div className="flex flex-col w-full max-w-5xl p-8 space-y-10 bg-white shadow-lg rounded-xl">
          <Spin spinning={loading}>
            <div className="flex justify-center">
              <Avatar
                onClick={() => {
                  if (!loading) inputRef.current.click();
                }}
                size={180}
                src={user?.photoUrl || "https://ui-avatars.com/api/?name=" + (user?.name || "G")}
                className="border-4 border-gray-200 shadow-lg"
              />
            </div>
          </Spin>
          <div className="text-center">
            <h3 className="text-4xl font-semibold text-blue-700">
              {user?.name}
            </h3>
            <p className="flex items-center justify-center mt-4 text-lg text-gray-700">
              <AiOutlineMail className="mr-2" />
              {user?.email}
            </p>
            <p className="flex items-center justify-center mt-2 text-lg text-gray-700">
              <AiOutlineUser className="mr-2" />
              {user?.profile?.title}
            </p>
            <p className="mt-2 text-lg text-gray-700">
              Skills: {user?.profile?.tags?.join(", ")}
            </p>
            <p className="mt-4 text-lg text-gray-700">
              Bio: {user?.profile?.bio}
            </p>
            {user?.profile?.college && (
              <p className="mt-2 text-lg text-gray-700">
                College: {user?.profile?.college}
              </p>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={loading}
          />

          <h3 className="text-2xl font-semibold text-center text-blue-700">
            Connect with Me
          </h3>
          <div className="flex justify-center mt-4 space-x-6">
            <a
              href={user?.profile?.socialLinks?.linkedin || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <AiFillLinkedin className="text-4xl" />
            </a>
            <a
              href={user?.profile?.socialLinks?.github || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-gray-900"
            >
              <AiFillGithub className="text-4xl" />
            </a>
            <a
              href={user?.profile?.socialLinks?.Twitter || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500"
            >
              <AiFillTwitterCircle className="text-4xl" />
            </a>
            <a
              href={user?.profile?.socialLinks?.facebook || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
            >
              <AiFillFacebook className="text-4xl" />
            </a>
            <a
              href={user?.profile?.socialLinks?.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
            >
              <AiOutlineGlobal className="text-4xl" />
            </a>
          </div>

          <Button
            type="primary"
            className="w-full mt-10 text-lg bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>

          <Modal
            title="Edit Profile"
            open={isEditing}
            onCancel={() => setIsEditing(false)}
            footer={null}
          >
            <Form
              initialValues={{
                name: user?.name,
                email: user?.email,
                title: user?.profile?.title,
                skills: user?.profile?.tags?.join(", "),
                bio: user?.profile?.bio,
                college: user?.profile?.college,
                social: {
                  linkedin: user?.profile?.socialLinks?.linkedin,
                  github: user?.profile?.socialLinks?.github,
                  twitter: user?.profile?.socialLinks?.Twitter,
                  facebook: user?.profile?.socialLinks?.facebook,
                  website: user?.profile?.socialLinks?.website,
                },
              }}
              onFinish={handleSubmit}
              layout="vertical"
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input your email!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please input your title!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Skills"
                name="skills"
                rules={[{ required: true, message: "Please input your skills!" }]}
              >
                <Input placeholder="Comma separated (e.g., JavaScript, React)" />
              </Form.Item>

              <Form.Item
                label="Bio"
                name="bio"
                rules={[{ required: true, message: "Please input your bio!" }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label="College"
                name="college"
                rules={[{ required: true, message: "Please input your college!" }]}
              >
                <Input />
              </Form.Item>

              <h3 className="mt-4 mb-2">Social Links</h3>
              <Form.Item label="LinkedIn" name={["social", "linkedin"]}>
                <Input />
              </Form.Item>
              <Form.Item label="GitHub" name={["social", "github"]}>
                <Input />
              </Form.Item>
              <Form.Item label="Twitter" name={["social", "twitter"]}>
                <Input />
              </Form.Item>
              <Form.Item label="Facebook" name={["social", "facebook"]}>
                <Input />
              </Form.Item>
              <Form.Item label="Website" name={["social", "website"]}>
                <Input />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-blue-600"
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
  );
};

export default Profile;
