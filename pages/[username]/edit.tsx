import type {NextComponentType, NextPageContext} from "next";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState, useRef, useMemo} from "react";
import {connect} from "react-redux";
import {
  getProfile as getProfileProps,
  editProfile as editProfileProps,
} from "../../store/actions";

import {Button} from "@mui/material";
import * as Alert from "../../components/Alert";

import styles from "../../styles/EditProfile.module.css";

interface Props {
  getProfile: Function;
  getProfileState: {
    fetch: boolean;
    data: {
      userId: string;
      avatar: string;
      bio: string;
      name: string;
      gender: string;
    };
    error: any;
  };
  editProfile: Function;
  editProfileState: {
    fetch: boolean;
    data: {
      userId: string;
    };
    error: any;
  };
}

const Liked: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const {getProfile, getProfileState, editProfile, editProfileState} = props;
  const avatarRef = useRef(null);
  const router = useRouter();
  const {username} = router.query;

  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
    bio: "",
    gender: "",
    avatar: "",
  });
  const [preview, setPreview] = useState("");

  const profileFormRows = [
    {name: "name", label: "Name", type: "text", value: profileForm?.name},
    {
      name: "username",
      label: "Username",
      type: "text",
      value: profileForm?.username,
    },
    {name: "bio", label: "Bio", type: "textarea", value: profileForm?.bio},
    {
      name: "gender",
      label: "Gender",
      type: "select",
      value: profileForm?.gender,
    },
  ];

  const disabledSubmit = useMemo(() => {
    let disabled = false;
    for (const key in profileForm) {
      if (!profileForm[key]) {
        disabled = true;
      }
    }
    return disabled;
  }, [profileForm]);

  const handleClickFile = () => {
    avatarRef.current.click();
  };
  const handleChangeForm = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setProfileForm({...profileForm, [name]: value});
    },
    [profileForm]
  );
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setProfileForm({...profileForm, [e.target.name]: file});
  };

  const renderInput = useCallback(
    (row: {type: string; name: string; label: string; value: string}) => {
      switch (row?.type) {
        case "textarea":
          return (
            <div className="vertical w-3/4">
              <textarea
                name={row?.name}
                type={row?.type}
                placeholder={row?.label}
                maxLength={150}
                className={`${styles.input}`}
                value={row?.value}
                onChange={handleChangeForm}
              />
              <small className={styles.textSecondary}>
                {row?.value?.length}/150
              </small>
            </div>
          );
        case "select":
          return (
            <div className="vertical w-3/4">
              <select
                name={row?.name}
                className={`${styles.input}`}
                onChange={handleChangeForm}
              >
                {!profileForm?.gender && (
                  <option selected hidden>
                    {`Select ${row?.label.toLowerCase()}`}
                  </option>
                )}
                <option
                  value={"male"}
                  selected={profileForm.gender === "male" ? true : false}
                >
                  Male
                </option>
                <option
                  value={"female"}
                  selected={profileForm.gender === "female" ? true : false}
                >
                  Female
                </option>
              </select>
            </div>
          );
        default:
          return (
            <div className="vertical w-3/4">
              <input
                name={row?.name}
                type={row?.type}
                placeholder={row?.label}
                className={`${styles.input}`}
                value={row?.value}
                onChange={handleChangeForm}
              />
            </div>
          );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profileForm]
  );

  const handleSubmitForm = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const {name, username, bio, gender, avatar} = profileForm;
      const formData = new FormData();
      formData.append(typeof avatar === "string" ? "avatar" : "file", avatar);
      formData.append("name", name);
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("gender", gender);
      editProfile({
        accessToken: localStorage.getItem("accessToken"),
        data: formData,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [profileForm]
  );

  useEffect(() => {
    if (username) {
      getProfile({
        accessToken: localStorage.getItem("accessToken"),
        data: username,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);
  useEffect(() => {
    const {userId, name, bio, gender, avatar} = getProfileState?.data;
    if (userId) {
      setProfileForm({
        ...profileForm,
        username: `${username || ""}`,
        name,
        bio,
        gender,
        avatar,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProfileState]);
  useEffect(() => {
    const userId = editProfileState?.data?.userId || "";
    if (userId) {
      router.push(`/${username}`);
      Alert.Success({text: "Success edit profile!"});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editProfileState]);

  return (
    <div className={`${styles.container} verticalCenter`}>
      <form
        className={`${styles.formContainer} vertical`}
        onSubmit={handleSubmitForm}
      >
        <div className={`${styles.formRow}`}>
          <div className="flex flex-row-reverse w-1/4">
            <img
              className="rounded-full w-14 h-14 mr-8"
              src={
                preview
                  ? preview
                  : profileForm.avatar ||
                    "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
              }
              alt="https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
            />
          </div>
          <div className="vertical w-3/4">
            <input
              name="avatar"
              type="file"
              accept="image/*"
              hidden
              ref={avatarRef}
              onChange={handleChangeFile}
            />
            <p className="">{username}</p>
            <p
              className="text-sky-500 hover:text-zinc-900 font-bold text-sm dark:hover:text-white"
              role="button"
              onClick={handleClickFile}
            >
              Change profile photo
            </p>
          </div>
        </div>
        {profileFormRows.map((row, idx) => (
          <div className={`${styles.formRow}`} key={idx}>
            <div className="flex flex-row-reverse w-1/4">
              <strong className="mr-8">{row?.label}</strong>
            </div>
            {renderInput(row)}
          </div>
        ))}
        <Button
          type="submit"
          variant="contained"
          style={{textTransform: "none"}}
          className={`${styles.btnPrimary}`}
          disabled={disabledSubmit}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

const mapStateToProps = (state: {
  rootReducer: {getProfile: Object; editProfile: Object};
}) => ({
  getProfileState: state.rootReducer.getProfile,
  editProfileState: state.rootReducer.editProfile,
});
const mapDispatchToProps = {
  getProfile: (payload: {accessToken: string; data: string}) =>
    getProfileProps(payload),
  editProfile: (payload: {accessToken: string; data: FormData}) =>
    editProfileProps(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(Liked);
