import type {
  GetServerSidePropsContext,
  NextComponentType,
  NextPageContext,
} from "next";
import {useRouter} from "next/router";
import {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
  Fragment,
  ChangeEvent,
} from "react";

import ModalPreview from "../../components/ModalPreview";
import {Avatar, Button} from "@mui/material";
import * as Alert from "../../components/Alert";

import styles from "../../styles/EditProfile.module.css";
import {getCookie} from "cookies-next";
import {editProfileApi, getProfileApi} from "../../store/api";
import useMutation from "../../hooks/useMutation";
import {useDispatch, useSelector} from "react-redux";
import {setSession} from "../../store/reducers/root";

interface Profile {
  id: number;
  username: string;
  email: string;
  avatar: string;
  name: string;
  bio: string;
  gender: string;
}

interface Props {
  editProfile: Function;
  editProfileState: {
    fetch: boolean;
    data: {
      userId: string;
      avatar: string;
    };
    error: any;
  };
  data: {data: Profile | any; error: any} | any;
}

interface ProfileForm {
  name: string;
  label: string;
  type: string;
  value: string;
  maxLength: number;
}

interface Session {
  accessToken: string;
  id: number;
  username: string;
  avatar: string;
}

const Liked: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const {
    data: {data, error},
  } = props;
  console.log({data, error});

  const avatarRef = useRef<HTMLInputElement>(
    typeof window === "object" ? document.createElement("input") : null
  );
  const router = useRouter();
  const {username} = router.query;
  const dispatch = useDispatch();
  const session =
    useSelector(
      (state: {
        rootReducer: {
          session: Session;
        };
      }) => state?.rootReducer?.session
    ) || {};

  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
    bio: "",
    gender: "",
    avatar: "",
  });
  const [preview, setPreview] = useState("");
  const [modalPreview, setModalPreview] = useState(false);

  const [
    editProfile,
    {data: dataEdit, loading: loadingEdit, error: errorEdit},
  ]: any[] = useMutation(editProfileApi);

  const profileFormRows: ProfileForm[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
      value: profileForm?.name,
      maxLength: 48,
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      value: profileForm?.username,
      maxLength: 16,
    },
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      value: profileForm?.bio,
      maxLength: 150,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      value: profileForm?.gender,
      maxLength: 0,
    },
  ];

  const disabledSubmit = useMemo(() => {
    if (loadingEdit) {
      return true;
    }
    let disabled = false;
    if (!profileForm?.username) return true;
    return disabled;
  }, [profileForm, loadingEdit]);

  useEffect(() => {
    console.log({disabledSubmit});
  }, [disabledSubmit]);

  const toggleModalPreview = () => {
    setPreview("");
    setProfileForm({...profileForm, avatar: data?.avatar});
    if (avatarRef?.current) {
      avatarRef.current.value = "";
    }
  };
  const submitModalPreview = () => {
    setModalPreview(false);
    if (avatarRef?.current) {
      avatarRef.current.value = "";
    }
  };
  const handleClickFile = () => {
    if (avatarRef?.current) {
      avatarRef.current.click();
    }
  };
  const handleChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let {name, value} = e.target;
      if (name === "username") {
        value = value.toLowerCase();
        if (value) value = value.trim();
        localStorage.username = value;
      }
      setProfileForm({...profileForm, [name]: value});
    },
    [profileForm]
  );
  const handleChangeTextArea = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      let {name, value} = e.target;
      if (name === "username") {
        value = value.toLowerCase();
        if (value) value = value.trim();
        localStorage.username = value;
      }
      setProfileForm({...profileForm, [name]: value});
    },
    [profileForm]
  );
  const handleChangeSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      let {name, value} = e.target;
      if (name === "username") {
        value = value.toLowerCase();
        if (value) value = value.trim();
        localStorage.username = value;
      }
      setProfileForm({...profileForm, [name]: value});
    },
    [profileForm]
  );
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: Blob = e?.target?.files?.[0] || new Blob();
    const url = URL.createObjectURL(file);
    setPreview(url);
    setProfileForm({...profileForm, [e.target.name]: file});
  };

  const RenderForm = useCallback(
    (row: ProfileForm) => {
      switch (row?.type) {
        case "textarea":
          return (
            <div className="vertical w-3/4">
              <textarea
                name={row?.name}
                placeholder={row?.label}
                maxLength={row?.maxLength}
                className={`${styles.input} ${
                  row?.type === "textarea" ? "mh-22" : ""
                }`}
                value={row?.value}
                onChange={handleChangeTextArea}
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
                onChange={handleChangeSelect}
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
                onChange={handleChangeInput}
                maxLength={row?.maxLength}
              />
              <small className={styles.textSecondary}>
                character limit is {row?.maxLength}
              </small>
            </div>
          );
      }
    },
    [profileForm, handleChangeInput, handleChangeSelect, handleChangeTextArea]
  );

  const handleSubmitForm = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      try {
        event.preventDefault();
        const {name, username, bio, gender, avatar} = profileForm;
        const formData = new FormData();
        formData.append(typeof avatar === "string" ? "avatar" : "file", avatar);
        formData.append("name", name);
        formData.append("username", username);
        formData.append("bio", bio);
        formData.append("gender", gender);
        await editProfile({
          data: formData,
        });
      } catch (err) {
        console.error(err);
      }
    },
    [profileForm, editProfile]
  );

  const usedAvatar = useMemo(() => {
    if (preview) {
      return preview;
    }
    return profileForm.avatar;
  }, [preview, profileForm.avatar]);

  useEffect(() => {
    const {id, name, bio, gender, avatar} = data;
    if (id) {
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
  }, [data]);

  useEffect(() => {
    const {id = 0, avatar = "", username = ""} = dataEdit || {};
    if (id) {
      dispatch(setSession({...session, username, avatar, id}));
      router.replace(`/${profileForm?.username}`);
      Alert.Success("Success edit profile!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataEdit]);

  useEffect(() => {
    if (errorEdit) {
      Alert.Error("Failed edit profile");
    }
  }, [errorEdit]);

  useEffect(() => {
    if (preview) {
      setModalPreview(true);
    } else {
      setModalPreview(false);
    }
  }, [preview]);

  return (
    <Fragment>
      <ModalPreview
        open={modalPreview}
        toggle={toggleModalPreview}
        file={preview}
        onSubmit={submitModalPreview}
      />
      <div className={`${styles.container} verticalCenter`}>
        <form
          className={`${styles.formContainer} vertical`}
          onSubmit={handleSubmitForm}
        >
          <div className={`${styles.formRow}`}>
            <div className="flex flex-row-reverse w-1/4">
              <Avatar
                className="rounded-full w-14 h-14 mr-8"
                src={usedAvatar}
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
              <div className="flex flex-row-reverse w-1/5 lg:w-1/4">
                <strong className="mr-4 text-sm lg:text-md lg:mr-8">
                  {row?.label}
                  {idx === 1 && <span className="text-red-500">*</span>}
                </strong>
              </div>
              {RenderForm(row)}
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
    </Fragment>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const {params, req, res} = context;
    const username: string | any = params?.username || "";
    const accessToken: string | any =
      getCookie("accessToken", {req, res}) || "";
    const {data} = await getProfileApi({accessToken, data: username || null});
    return {
      props: {data: data},
    };
  } catch (error) {
    return {
      props: {data: {error, data: null}},
    };
  }
};

export default Liked;
