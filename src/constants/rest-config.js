// Crayond
const REST_CONFIG = {
  // BASEURL: '127.0.0.1:3000',
  // METHOD: 'http',
  // BASEURL_AUTH: 'localhost:5000',
  BASEURL: process.env.REACT_APP_BASEURL,
  METHOD: process.env.REACT_APP_METHOD,
  BASEURL_AUTH: process.env.REACT_APP_BASEURL_AUTH,
  FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  FIREBASE_VAPIDKEY: process.env.REACT_APP_FIREBASE_VAPIDKEY,
  SENTRY_AUTH_TOKEN: process.env.REACT_APP_SENTRY_AUTH_TOKEN,
  DIGIURL: process.env.REACT_APP_DIGICARDURL,
  DIGIAUTH: process.env.REACT_APP_DIGICARDAUTH,
};

// QA Instance Apache 9 Demo
/*
const REST_CONFIG = {
  BASEURL: "65.1.238.219",
  METHOD: "http",
  PORT: 9080,
  RESTAPPNAME: "teckonnecteep",
};
*/

// Demo Instance Apache 10
/*
const REST_CONFIG = {
  BASEURL: "13.235.139.216",
  METHOD: "http",
  PORT: 9080,
  RESTAPPNAME: "teckonnect",
};
*/

const URL_CONFIG = {
  LOGIN: '/api/auth/signin',
  LOGOUT: '/api/auth/signout',
  FORGOTPASSWORD: '/api/auth/forgotpassword',
  RESETPASSWORD: '/api/auth/resetpassword',
  UPDATEPASSWORD: '/users/updatepassword',
  ALLUSERS: '/users',
  SETACTIVELOG: '/users/set_activity_log',
  ALL_USER_DETAILS_FILTER_RESPONSE: '/users/getUserDetails',
  GETALLUSERS: '/users',
  // GETALLUSERS: "/users/activeuser",
  GETUSER: '/users/user',
  GETUSER_PROFILE: '/users/user-profile',
  GET_USERS_BY_DEPARTMENT: '/users/getusersbydepartment',
  IMPORT_USERS: '/excels/import',
  UPDATEUSERSIGNATURE: '/users/signatureuploadurl',
  ALLDEPARTMENTS: '/departments/activedepartment',
  ADDDEPARTMENT: '/departments/department',
  DEPT_USERS: '/users/getusersbydepartmentlist',
  ROLE_USERS: '/roles/roleidbyuser',
  HASHTAGALL: '/hashtags',
  ADDHASHTAG: '/hashtags/hashtag',
  ACTIVE_HASHTAG: '/hashtags/activehashtag',
  HASHTAG_BULK_UPDATE: '/hashtags/activehashtag',
  ALLROLES: '/roles/roles',
  ADDROLE: '/roles/role',
  ROLES_BULK_UPDATE: '/roles/updateroles',
  GET_ROLE_PERMISSIONS: '/roleScreenMappings/rolescreenroleid',
  ROLE_SCREEN_MAPPING: '/roles/id',
  ROLE_SCREEN_UPDATE: '/roles/screen',
  USER_PERMISSION: '/roleScreenMappings/rolescreenroleid',
  ALLBADGES: '/badges/activebadge',
  CREATE_BADGE: '/badges/badge',
  LIBRARY_BADGES: '/library/allbadge',
  RECOGNIZE_BADGE: '/badges/assignbadge',
  MY_BADGES: '/badges/mybadges',
  BADGE_BULK_UPDATE: '/badges/badge',
  SHARE_WALL: '/socialwall/sharewall',
  CREATE_AWARD: '/awards/award',
  LIBRARY_AWARDS: '/library/allawards',
  ALLAWARDS: '/awards/activeaward',
  AWARD_BULK_UPDATE: '/awards/award',
  SPOT_AWARD: '/awards/spotaward',
  NOMINATOR_AWARDS: '/awards/nominatorview',
  AWARD_RECOGNITION: '/awards/awardtype',
  RECOGNIZE_SPOT_AWARD: '/awards/spotawardrecognize',
  NOMINATE_DO_AWARD: '/awards/donomination',
  MY_AWARDS: '/awards/myawards',
  NOMINATE_AWARD: '/awards/nominateaward',
  MY_NOMINATIONS: '/awards/mynominations',
  NOMINATIONS_LIST: '/awards/listnominations',
  MY_APPROVALS: '/awards/myapprovals',
  APPROVE_RECOGNISED_AWARDS: '/awards/doapprove',
  MANAGE_AWARDS: '/awards/manage',
  CERTIFICATE: '/certificates/certificate',
  ALL_CERTIFICATE: '/certificates/all',
  ASSIGN_CERTIFICATE: '/certificates/assigncertificate',
  MY_CERTIFICATES: '/certificates/mycertificate',
  CREATE_TEMPLATE_ECARD: '/ecards/ecard',
  GET_TEMPLATE_ECARD: '/ecards/templates',
  CREATE_TEMPLATE_MESSAGE: '/ecards/message',
  GET_TEMPLATE_MESSAGE: '/ecards/messages',
  GET_SCHEDULETIME: '/ecards/scheduletime',
  SCHEDULE_BIRTHDAY: '/ecards/birthdaySettings',
  DELETE_TEMPLATE_CARD: '/ecards/deletetemplate',
  DELETE_TEMPLATE_MESSAGE: '/ecards/deletemessage',
  ALL_ECARDS: '/ecards/alltemplates',
  ALL_MESSAGES: '/ecards/allmessages',
  ANNIVERSARY_ECARD: '/ecards/anniversary',
  GET_ANNIVERSARY_YEARS: '/ecards/allyear',
  DELETE_YEAR: '/ecards/deleteyearinterval',
  SCHEDULE_ANNIVERSARY: '/ecards/anniversarysettings',
  SEND_ECARD: '/ecards/sendecard',
  ECARD_INBOX: '/ecards/mycards',
  ECARD_LIKE: '/ecards/likecards',
  READ_ALL_ECARD: '/ecards/readall',
  REFRESH_TOKEN: '/api/auth/refreshtoken',
  SOCIALWALL_GET_USERLIST: '/socialwall/userlist',
  SOCIALWALL_HASTAG_LIST: '/socialwall/hashtagList',
  SOCIALWALL_LIST: '/socialwall/wall',
  SOCIALWALL_SINGLE: '/socialwall/wallid',
  SOCIALWALL_LIKE: '/socialwall/likepost',
  SOCIALWALL_DISLIKE: '/socialwall/deletelikepost',
  SOCIALWALL_COMMENT: '/socialwall/comments',
  SOCIALWALL_COMMENT_LIST: '/socialwall/commentslist',
  SOCIALWALL_REPLY: '/socialwall/commentsreply',
  IDEA: '/ideas/idea',
  IDEA_READ_UNREAD: '/ideas/idearead',
  IDEA_IMPORTANT_UNIMPORTANT: '/ideas/ideafavorites',
  IDEA_READ_ALL: '/ideas/ideareadall',
  IDEA_LIKE_DISLIKE: '/ideas/idealikes',
  IDEA_BY_ID: '/ideas/ideaid',
  IDEA_COMMENT: '/ideas/ideacomments',
  MY_IDEAS: '/ideas/myidea',
  FORUM: '/forums/forum',
  GET_FORUM_LIST: '/forums/forum',
  GET_FORUM_HOT_TOPICS_LIST: '/forums/forumhottopics',
  FORUM_FOLLOWING: '/forums/forumfollowing',
  FORUM_READ_UNREAD: '/forums/forumread',
  FORUM_READ_ALL: '/forums/forumreadall',
  FORUM_COMMENTS: '/forums/comments',
  FORUM_BY_ID: '/forums/forumid',
  MY_FORUMS: '/forums/myforum',
  ENLITE_FORUM: '/forums/forumlikes',
  FORUM_COMMENT_LIKE_UNLIKE: '/forums/commentlikes',
  FORUM_DELETE_COMMENT: '/forums/deletecomments',
  FORUM_COMMENTS_REPLY: '/forums/commentsreply',
  SURVEY: '/surveys/survey',
  PENDING_SURVEY: '/surveys/surveypending',
  SHOW_SURVEY: '/surveys/surveyshow',
  MY_SURVEY: '/surveys/mysurvey',
  SURVEY_RESULT: '/surveys/surveyresult',
  SURVEY_RESPONSE: '/surveys/response',
  SURVEY_QUESTIONBANK: '/surveys/questionbank',
  SURVEY_SUBMIT: '/surveys/submit',
  SURVEY_IMPORTANT_UNIMPORTANT: '/surveys/surveyimportant',
  SURVEY_MODIFY: '/surveys/modify',
  SURVEY_BY_ID: '/surveys/surveyid',
  SURVEY_REPUBLISH: '/surveys/republish',
  SURVEY_ACCEPT_RESPONSE: '/surveys/toggleresponse',
  SURVEY_ENPS_RESPONSE: '/surveys/enps',
  SURVEY_PULSE_RESPONSE: '/surveys/pulse',
  SURVEY_PULSE_RESPONSE_COMPARE: '/surveys/pulsecompare',
  POLL: '/polls/poll',
  CLOSED_POLLS: '/polls/closedpoll',
  ACTIVE_POLLS: '/polls/activepoll',
  POLL_GET_BY_ID: '/polls/pollid',
  POLL_SUBMIT: '/polls/submitpoll',
  POLL_RESPONSE: '/polls/pollresponse',
  DASHBOARD_INDEX: '/dashboards/index',
  USER_DASHBOARD: '/dashboards/dashboardUser',
  REWARDS_RECOGNITION: '/dashboards/rewardrecognition',
  HALL_OF_FAME: '/dashboards/hall',
  GET_POINTS: '/points/point',
  NOTIFICATIONS_BY_ID: '/notification/notification',
  NOTIFICATIONs_READ: '/notification/read',
  NOTIFICATIONs_DELETE: '/notification/delete',
  TOUR: '/users/tour',
  TOUR_UPDATE: '/users/projecttour',
  SEARCH: '/users/search',
  TOKEN_UPDATE: '/users/set_device_token',

  AUTH_LOGIN_URL: '/api/v1/auth/login',
  AUTH_REST_PASSWORD_URL: '/api/v1/auth/reset_password',
  AUTH_FORGOT_PASSWORD_URL: '/api/v1/auth/forgot_password',
  AUTH_FORGOT_PASSWORD_EMAIL_URL: '/auth/forgot_password_mail',
  RESETPASSWORD_AUTH: '/api/v1/auth/reset_password',
  UPLOAD_FILES: '/file/upload_files',
  ADD_ADMIN_PANEL: '/adminpanel/panel',
  ADD_ADMIN_HEADER_LOGO: '/adminpanel/headerlogo',
  ADD_ADMIN_LOGIN_LOGO: '/auth/panel',
  UPDATE_USER_SIGNATURE: '/users/user',
  REFRESH_TOKEN_AUTH: '/api/v1/auth/refresh',
  AUTH_ADD_NEW_USER: '/api/v1/auth/signup',
  ADDBRANCH: '/branches/create',
  UPDATE_BRANCH: '/branches/update',
  GET_ALL_BRANCH: '/branches/branches',
  GET_ALL_COUNTRY: '/country/country_name',
  GET_ALL_BRANCH_NAME: '/branches/branch_name',
  UPSERT_BULK_USER: '/users/bulkuser',
  UPSERT_BULK_ORG: '/users/bulkorg',
  EXPORT_BULK_ORG: '/users/export_org',
  UPDATE_SLACK_USERS: '/users/fetch_slack_user',

  ADD_FEEDBACK: '/feedback/createFeedback',
  GET_FEED_CATEGORY: '/feedback/get_category',
  GET_ALL_FEEDBACKS: '/feedback/get_feedback',
  FEEDBACK_IMPORTANT_UNIMPORTANT: '/feedback/feedbackfavorites',
  FEEDBACK_READ_UNREAD: '/feedback/feedbackread',
  FEEDBACK_READ_ALL: '/feedback/feedbackreadall',
  FEEDBACK_BY_ID: '/feedback/feedback_by_id',
  FEEDBACK_LIKE_DISLIKE: '/feedback/feedbacklikes',
  FEEDBACK_COMMENT: '/feedback/feedbackcomments',
  FEEDBACK_LIKE_DISLIKE_CHILD: '/feedback/feedbacklikechilds',
  MY_FEEDBACK: '/feedback/myfeedback',
  FEEDBACK_DELETE: '/feedback/myfeedback',
  ALL_SURVEY: '/library/survey',
  LIBRARY_ADD_SURVEY: '/library/survey/add',
  GET_LIBRARY_SURVEY: '/surveys/get-library',
  SHOW_LIBRARY_SURVEY: '/surveys/surveylibraryshow',
  USER_VALIDATION: '/auth/user_validation',
  USER_CONTACT_UPDATE: '/users/user-contact',
  SCHEDULE_ECARD: '/ecards/schedulercards',
  GIFT_VOUCHER: '/gifts/getRedemption',
  POST_REDEEM: '/gifts/postRedeem',
  GET_REDEEM: '/gifts/getRedeemPoints',
  GET_POINTS_CONFIG: '/gifts/getPointsConfig',
  ADD_POINTS_CONFIG: '/gifts/updatePoints',
  GET_POINTS_VALUE: '/gifts/getPointsValue',
  REDEEM: '/digicard/gift',

  GET_ROLES_INAPP: '/roles/roles',
  GET_AWARDS_APPROVAL_ID: '/awards/myapprovalsid',

  UPDATEUSERROLE: '/roles/user',

  CREATEEMAILTEMPLATE: '/email/createTemplate',
  UPDATEEMAILTEMPLATE: '/email/updateEmailTemplate',
  GETEMAILTEMPLATELIST: '/email/getAllEmail',
  GETEMAILTEMPLATE: '/email/getEmailTemplate',
  TRIGGEREMAILTEMPLATE: '/email/triggermail',

  YGGORDER: '/ygg/order',
  YGGBRANDLIST: '/ygg/yggbrands',
  YGGCOUNTRYMAPPING: '/ygg/countrybranchList',
  YGGBRANDSYNC: '/ygg/brandsyncbycountry',
  YGG_GET_COUNTRY: '/ygg/yggcountry',
  YGG_GET_COUNTRIES_LIST: '/ygg/countrybranchList',
  YGG_COUNTRY: '/ygg/country',
  YGG_Info: '/ygg/syncinfo',
  YGG_Account: '/ygg/yggaccount',
};

const ROUTE_URL = {
  BULKUPLOADORGCHART: '/app/orgChart',

  IDMROLEMAPPING: '/app/idm',

  HOME: '/app/dashboard',

  USERDASHBOARD: '/app/userdashboard',

  USERMANAGEMENT: '/app/usermanagement',

  REGISTERUSER: '/app/newUser',

  MYPROFILE: '/app/myprofile',

  LISTDEPARTMENTS: '/app/listdepartments',

  ADMINPANEL: '/app/adminpanel',

  BRANCHMASTER: '/app/branchMaster',

  HELP: '/app/help',

  VIEWUSER: '/app/users/view/:id',

  MODIFYUSER: '/app/users/update/:id',

  PORTALSETTINGS: '/app/portalsettings',

  HASHTAG: '/app/hashtag',

  RECOGNITION: '/app/recognition',

  LIBRARY: '/app/library',

  CREATEAWARD: '/app/createaward',

  BADGES: '/app/badges',

  CREATEBADGE: '/app/createbadge',

  CERTIFICATES: '/app/certificates',

  MYCERTIFICATE: '/app/mycertificates',

  CERTIFICATECOMPOSE: '/app/composecertificate',

  AWARDS: '/app/awards',

  AWARDNOMINATIONS: '/app/awardnominations',

  NOMINATIONSAPPROVAL: '/app/nominationsapproval',

  MANAGESPOTAWARDVIEW: '/app/managespotawardview',

  MANAGENOMINATEAWARDVIEW: '/app/managenominateawardview',

  ECARDINDEX: '/app/ecardIndex',

  BIRTHDAYTEMPLATESETTINGS: '/app/birthdaytemplatesettings',

  WORKANNIVERSARYSETTINGS: '/app/workanniversarysettings',

  APPRECIATIONTEMPLATESETTINGS: '/app/appreciationtemplatesettings',

  SEASONALTEMPLATESETTINGS: '/app/seasonaltemplatesettings',

  INBOX: '/app/inbox',

  INBOXDETAILVIEW: '/app/inboxdetailview',

  SOCIALWALL: '/app/socialwall',

  COMMUNICATION: '/app/engage',

  SURVEYRESULT: '/app/survey',

  CREATESURVEY: '/app/createsurvey',

  SURVEYANSWER: '/app/surveyanswer',

  SURVEYLIBRARYANSWER: '/app/surveylibrary',

  MYSURVEY: '/app/mysurvey',

  MYLIBRARY: '/app/librarysurvey',

  SURVEYQUESTIONS: '/app/surveyquestions',

  NPS: '/app/nps',

  PULSE: '/app/pulse',

  METRIC: '/app/metric',

  SURVEYRESPONSES: '/app/surveyresponses',

  IDEABOX: '/app/ideabox',

  FEEDBACK: '/app/feedback',

  FORUM: '/app/forum',

  FORUMDETAILVIEW: '/app/forumdetailview',

  POLLANSWER: '/app/pollanswer',

  CREATEPOLL: '/app/createpoll',

  CLOSEDPOLLS: '/app/closedpolls',

  POLLRESULTS: '/app/polls',

  ACTIVEPOLLS: '/app/activepolls',

  NOTIFICATIONS: '/app/notifications',

  REWARDS: '/app/points',

  EEPAPP: '/app/eepapp',

  SEARCH: '/app/search',

  MYPROFILECOUPON: '/app/my-redeem',

  POINTSCONFIG: '/app/point-config',

  WALLET: '/app/wallet',
};

const IMAGE_URL = {
  SURVEY: '/images/icons/communications/survey.svg',
  FORUM: '/images/icons/communications/Forum.svg',
  IDEABOX: '/images/icons/communications/ideabox.svg',
  POLL: '/images/icons/communications/polls.svg',
  FEED: '/images/icons/communications/feed.png',

  AWARDS: '/images/icons/recognition/awards.svg',
  BADGES: '/images/icons/recognition/badges.svg',
  CERTIFICATES: '/images/icons/recognition/certificates.svg',
  ECARD: '/images/icons/recognition/certificates.svg',
  BRANCH: '/images/icons/adminpanel/Branch.svg',
  SOCIALWALL: '/images/icons/recognition/SocialWall.svg',

  ECARDINDEX: '/images/icons/recognition/e-cards.svg',
  NOMINATIONSAPPROVAL: '/images/icons/recognition/awards.svg',
  FORUMDETAILVIEW: '/images/icons/communications/Forum.svg',
  POLLANSWER: '/images/icons/communications/polls.svg',
  SURVEYANSWER: '/images/icons/communications/survey.svg',
};

export { REST_CONFIG, URL_CONFIG, ROUTE_URL, IMAGE_URL };
