import { createSlice } from "@reduxjs/toolkit";

const initialState = { svgIcons: {}, badgeSeledtedUsers: [], awardNominators: { users: [] }, userRolePermission: {}, tourState: {}, isNotification: {} };

const sharedDataSlice = createSlice({
  name: "sharedData",
  initialState,
  reducers: {
    getSvgIcons(state, actions) {
      state.svgIcons = actions.payload.svgIcons;
    },
    updateBadgeSelectedUsers(state, action) {
      const checked = action.payload.checked;
      const value = action.payload.value;
      if (checked) {
        state.badgeSeledtedUsers.push(value);
      } else {
        state.badgeSeledtedUsers.splice(state.badgeSeledtedUsers.indexOf(value), 1);
      }

      const userCheckBox = document.getElementsByClassName('assign-users-list');
      for (let i = 0; i < userCheckBox.length; i++) {
        if (userCheckBox[i]) {
          userCheckBox[i]['checked'] = false
        }

      }

      state.badgeSeledtedUsers.map(res => {
        if (document.getElementById('flexCheckDefault_' + res)) {
          document.getElementById('flexCheckDefault_' + res).checked = true;
        }
      })


    },
    badgeAllUsersUpdate(state, action) {
      state.badgeSeledtedUsers = action.payload;
      const userCheckBox = document.getElementsByClassName('assign-users-list');
      for (let i = 0; i < userCheckBox.length; i++) {
        if (userCheckBox[i]) {
          userCheckBox[i]['checked'] = false
        }

      }

      state.badgeSeledtedUsers.map(res => {
        if (document.getElementById('flexCheckDefault_' + res)) {
          document.getElementById('flexCheckDefault_' + res).checked = true;
        }

      })
    },
    getUsersListForAwardNominators(state, action) {
      state.awardNominators.users = action.payload.uDatas;
    },
    getUserRolePermission(state, action) {
      state.userRolePermission = action.payload.userRolePermission;
    },
    getTourState(state, action) {
      state.tourState = action.payload.tourState;
    },
    getIsNotification(state, action) {
      state.isNotification = action.payload.isNotification;
    }

  },
});

export const sharedDataActions = sharedDataSlice.actions;
export default sharedDataSlice;
