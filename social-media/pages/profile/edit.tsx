import {useCallback, useEffect, useState, useRef} from "react";
import type {NextComponentType, NextPageContext} from "next";
import {Button} from "@mui/material";

import styles from "../../styles/EditProfile.module.css";

interface Props {}

const Liked: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const avatarRef = useRef(null);

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

  useEffect(() => {
    setPreview(
      "https://pbs.twimg.com/profile_images/1284155869060571136/UpanAYid_400x400.jpg"
    );
  }, []);

  return (
    <div className={`${styles.container} verticalCenter`}>
      <form className={`${styles.formContainer} vertical`}>
        <div className={`${styles.formRow}`}>
          <div className="flex flex-row-reverse w-1/4">
            <img
              className="rounded-full w-14 h-14 mr-8"
              src={
                preview
                  ? preview
                  : "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
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
            <p className="">tondikii</p>
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
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Liked;
