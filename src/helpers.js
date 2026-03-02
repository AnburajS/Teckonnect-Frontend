import * as XLSX from 'xlsx';
import { URL_CONFIG } from './constants/rest-config';
import { httpHandler } from './http/http-interceptor';
//import { idmRoleMapping } from "./idm";
import { sharedDataActions } from './store/shared-data-slice';
import i18n from 'i18next';

export const base64ToFile = (base64Data) => {
  const binaryString = atob(base64Data);
  const byteNumbers = new Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteNumbers[i] = binaryString.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/png' });
  const file = new File([blob], 'filename.png', { type: 'image/png' });

  return file;
};

// export const sideMenuHidden = (data, userRolePermission) => {
//   let arr = data ?? [];

//   if (!userRolePermission?.orgChart) {
//     const i = arr?.findIndex((v) => v.org);
//     delete arr[i];
//   }
//   // if (!userRolePermission?.surveyCreate && !userRolePermission?.surveyModify) {
//   //   const parentI = arr?.findIndex((v) => v.communication);
//   //   const parent = arr?.find((v) => v.communication);
//   //   const i = parent.subMenu.filter((v) => !v.survey);
//   //   parent.subMenu = i;
//   //   arr[parentI] = parent;
//   // }
//   // if (!userRolePermission?.forumHide) {
//   //   const parentI = arr?.findIndex((v) => v.communication);
//   //   const parent = arr?.find((v) => v.communication);
//   //   const i = parent.subMenu.filter((v) => !v.forum);
//   //   parent.subMenu = i;
//   //   arr[parentI] = parent;
//   // }
//   // if (!userRolePermission?.pollCreate && !userRolePermission?.pollModify) {
//   //   const parentI = arr?.findIndex((v) => v.communication);
//   //   const parent = arr?.find((v) => v.communication);
//   //   const i = parent.subMenu.filter((v) => !v.polls);
//   //   parent.subMenu = i;
//   //   arr[parentI] = parent;
//   // }
//   // if (!userRolePermission?.ideaboxHide) {
//   //   const parentI = arr?.findIndex((v) => v.communication);
//   //   const parent = arr?.find((v) => v.communication);
//   //   const i = parent.subMenu.filter((v) => !v.ideabox);
//   //   parent.subMenu = i;
//   //   arr[parentI] = parent;
//   // }
//   // if (
//   //   !userRolePermission?.surveyCreate &&
//   //   !userRolePermission?.surveyModify &&
//   //   !userRolePermission?.forumHide &&
//   //   !userRolePermission?.pollCreate &&
//   //   !userRolePermission?.pollModify &&
//   //   !userRolePermission?.ideaboxHide
//   // ) {
//   //   const i = arr?.findIndex((v) => v.communication);
//   //   delete arr[i];
//   // }
//   if (
//     !userRolePermission?.awardCreate &&
//     !userRolePermission?.certificateCreate &&
//     !userRolePermission?.badgeCreate
//   ) {
//     const i = arr?.findIndex((v) => v?.library);
//     delete arr[i];
//   }
//   //  if (!userRolePermission?.awardCreate && !userRolePermission?.certificateCreate &&
//   //     !userRolePermission?.badgeCreate) {
//   //     const parentI = arr.findIndex(v => v.recognition);
//   //     const parent = arr.find(v => v.recognition);
//   //     const i = parent.subMenu.filter(v => !v.library)
//   //     parent.subMenu = i
//   //     arr[parentI] = parent
//   // };

//   return arr;
// };

export const sideMenuHidden = (data, userRolePermission) => {
  let arr = data ?? [];

  if (
    !userRolePermission?.awardCreate &&
    !userRolePermission?.certificateCreate &&
    !userRolePermission?.badgeCreate &&
    !userRolePermission?.surveyCreate
  ) {
    const i = arr?.findIndex((v) => v?.library);
    delete arr[i];
  }

  return arr;
};
export const headerMenuHidden = (data, userRolePermission) => {
  if (
    !userRolePermission?.awardCreate &&
    !userRolePermission?.certificateCreate &&
    !userRolePermission?.badgeCreate &&
    !userRolePermission?.surveyCreate
  ) {
    return false;
  }

  return true;
};
export const downloadXlsx = (name, data) => {
  const worksheet = XLSX.utils.json_to_sheet(data ?? []);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, name);
};

export const pageLoaderHandler = (arg) => {
  const element = document.getElementById('page-loader-container');
  if (element?.classList) {
    element.classList.remove('d-none', 'd-block');

    if (arg === 'show') {
      element.classList.add('d-block');
    } else {
      element.classList.add('d-none');
    }
  }
};

export const fetchUserPermissions = async (dispatch) => {
  const obj = {
    url: URL_CONFIG.USER_PERMISSION,
    method: 'get',
  };
  await httpHandler(obj)
    .then(async (response) => {
      // const roleData = await idmRoleMapping(response?.data?.roleId?.idmID);

      const getAndUpdate = sessionStorage.getItem('userData');
      const arabic = (response?.data?.theme).some(
        (obj) => obj.language === 'Arabic (AR)' && obj.id === 1,
      );
      const addFileds = {
        ...JSON.parse(getAndUpdate),
        firstName: response?.data?.firstName,
        lastName: response?.data?.lastName,
        allPoints: response?.data?.totalPoints,
        HeaderLogo: response?.data?.HeaderLogo,
        userLogo: response?.data?.userLogo,
        theme: response?.data?.theme,
        orgId: response?.data?.orgId ?? '',
        countryDetails: response?.data?.countryDetails ?? '',
        arabic: arabic,
        departmentID: response?.data?.department_id ?? '',
      };
      sessionStorage.setItem('userData', JSON.stringify(addFileds));
      // arabic ? i18n.changeLanguage('ar') : i18n.changeLanguage('en');
      const preferredLang = localStorage.getItem('appLanguage');

      // 1) if user selected language, always use it
      if (preferredLang) {
        i18n.changeLanguage(preferredLang);
      } else {
        // 2) else use portal setting default
        arabic ? i18n.changeLanguage('ar') : i18n.changeLanguage('en');
      }

      const dir = i18n.dir(i18n.language);
      document.documentElement.dir = dir;

      // await dispatch(
      //   sharedDataActions.getUserRolePermission({
      //     userRolePermission: roleData?.data,
      //   })
      // );

      await dispatch(
        sharedDataActions.getUserRolePermission({
          userRolePermission: response?.data?.screen,
        }),
      );
    })
    .catch((error) => {});
};

export function getCurrencyForCounty(country, user_points, value) {
  let calculatedValue = 0;
  if (country === 'India') {
    return (calculatedValue = user_points * value);
  } else {
    return calculatedValue;
  }
}

export const Progress = ({ strokeWidth, percentage }) => {
  const radius = 50 - strokeWidth / 2;
  const pathDescription = `
      M 50,50 m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius}
      a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;

  const diameter = Math.PI * 2 * radius;
  const progressStyle = {
    stroke: percentage >= 50 ? '#007dbc' : 'red',
    strokeLinecap: 'round',
    strokeDasharray: `${diameter}px ${diameter}px`,
    strokeDashoffset: `${((100 - percentage) / 100) * diameter}px`,
  };

  return (
    <svg
      className={'CircularProgressbar'}
      viewBox="0 0 100 100"
      width={100}
      height={100}
    >
      <path
        className="CircularProgressbar-trail"
        d={pathDescription}
        strokeWidth={strokeWidth}
        fillOpacity={0}
        style={{
          stroke: '#d6d6d6',
        }}
      />

      <path
        className="CircularProgressbar-path"
        d={pathDescription}
        strokeWidth={strokeWidth}
        fillOpacity={0}
        style={progressStyle}
      />

      <text
        className="CircularProgressbar-text"
        x={50}
        y={50}
        style={{
          fill: percentage >= 50 ? '#007dbc' : 'red',
          fontSize: '24px',
          dominantBaseline: 'central',
          textAnchor: 'middle',
        }}
      >
        {`${percentage}%`}
      </text>
    </svg>
  );
};

export const getRolesInApp = async (activeState) => {
  let retData = [];
  const obj = {
    url: URL_CONFIG.GET_ROLES_INAPP,
    method: 'get',
    params: activeState ? { is_active: activeState } : {},
  };
  await httpHandler(obj)
    .then((response) => {
      retData = response.data;
    })
    .catch((error) => {});

  return retData;
};

export const fetchUserlogin = async (token) => {
  const obj1 = {
    url: URL_CONFIG.SETACTIVELOG,
    method: 'post',
    payload: token ? token : {},
  };
  httpHandler(obj1)
    .then((res) => {
      if (token) {
        sessionStorage.clear();
        localStorage.clear();
      }
    })
    .catch((error) => {});
};

export const capitalizeFirstLetter = (string) => {
  if (string === 'Ecards') {
    return 'E-Cards';
  }
  console.log(string);
  if (string === 'EnliteU Wall') {
    return 'EnliteU Wall';
  }
  return string
    .split(/[-\s]/) // Split by both dashes and spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(' '); // Join the words back with spaces
};
export const fileTypeAndImgSrcArray = {
  'image/pdf': process.env.PUBLIC_URL + '/images/icons/special/pdf.svg',
  'application/pdf': process.env.PUBLIC_URL + '/images/icons/special/pdf.svg',
  'application/mspowerpoint':
    process.env.PUBLIC_URL + '/images/icons/special/ppt.svg',
  'application/powerpoint':
    process.env.PUBLIC_URL + '/images/icons/special/ppt.svg',
  'application/vnd.ms-powerpoint':
    process.env.PUBLIC_URL + '/images/icons/special/ppt.svg',
  'application/x-mspowerpoint':
    process.env.PUBLIC_URL + '/images/icons/special/ppt.svg',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    process.env.PUBLIC_URL + '/images/icons/special/ppt.svg',
  'application/vnd.ms-excel':
    process.env.PUBLIC_URL + '/images/icons/special/xlsx.svg',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    process.env.PUBLIC_URL + '/images/icons/special/xlsx.svg',
  'application/zip': process.env.PUBLIC_URL + '/images/icons/special/zip.svg',
  'application/x-zip-compressed':
    process.env.PUBLIC_URL + '/images/icons/special/zip.svg',
  'application/msword':
    process.env.PUBLIC_URL + '/images/icons/special/word.svg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    process.env.PUBLIC_URL + '/images/icons/special/word.svg',
  'image/jpeg': process.env.PUBLIC_URL + '/images/icons/special/jpeg.svg',

  'image/png': process.env.PUBLIC_URL + '/images/icons/special/jpeg.svg',
  'image/gif': process.env.PUBLIC_URL + '/images/icons/special/gif.svg',
  'image/svg+xml': process.env.PUBLIC_URL + '/images/icons/special/jpeg.svg',
  'application/octet-stream':
    process.env.PUBLIC_URL + '/images/icons/special/doc.svg',
  default: process.env.PUBLIC_URL + '/images/icons/special/default-doc.svg',

  'image/x-zip-compressed':
    process.env.PUBLIC_URL + '/images/icons/special/zip.svg',

  'image/xlsx':
    process.env.PUBLIC_URL + '/images/icons/special/icons8-excel-48.png',

  'image/svg+xmll': process.env.PUBLIC_URL + '/images/icons/special/jpeg.svg',

  'image/svg+xmll': process.env.PUBLIC_URL + '/images/icons/special/jpeg.svg',

  'image/jpg': process.env.PUBLIC_URL + '/images/icons/special/jpeg.svg',
};
