// import { getRoles, initializeIDM, validateAuthorization } from '@crayond_dev/idm-client';

// export const idmRoleMapping = async (role, permission = ['update', 'read', 'create', 'delete']) => {

//     const roles = await getRoles({ apiKey: "ASC4PK0UVE5OOCO8NK" });
//     const finfRole = roles.find(v => v.id === role)
//     const isIDMInitialized = await initializeIDM({ apiKey: "ASC4PK0UVE5OOCO8NK", roleId: finfRole?.id });
//     const GetPermissions = JSON.parse(localStorage.getItem('permissions'));
//     var validate = null;
//     if (isIDMInitialized) {
//         validate = validateAuthorization(getIds(GetPermissions), permission);
//     }
//     return { roleId: finfRole?.id, data: getPermission(GetPermissions, validate), rolesData: roles }
// }

// export const idmRoleMappingRoles = async (role, permission = ['update', 'read', 'create', 'delete']) => {
//     const roles = await getRoles({ apiKey: "ASC4PK0UVE5OOCO8NK" });
//     const finfRole = roles.find(v => v.id === role)
//     const isIDMInitialized = await initializeIDM({ apiKey: "ASC4PK0UVE5OOCO8NK", roleId: finfRole?.id });
//     const GetPermissions = roles?.find(v => v?.id === role)?.role_permission_mappings?.[0]?.permission?.data?.data ?? []
//     var validate = null;
//     if (isIDMInitialized) {
//         validate = validateAuthorization(getIds(GetPermissions), permission);
//     }
//     return { roleId: finfRole?.id, data: getPermission(GetPermissions, validate), rolesData: roles }
// }

// export const idmRoleMappingRolesInApp = async (role, permission = ['update', 'read', 'create', 'delete']) => {
// }


const getIds = (GetPermissions) => {
    let array = [];
    const chilMapped = (data) => {
        return data?.map(v => {
            array.push(v?.id)
            chilMapped(v?.child)
        })
    }
    chilMapped(GetPermissions ?? []);
    return array;
}

const getPermission = (GetPermissions, validate) => {

    let array = {};
    const chilMapped = (data, name) => {
        return data?.map(v => {
            // let nm = v?.name ?? ''
            // if (name?.toLowerCase() === 'awards') {
            //     nm = 'award ' + v?.name
            // } else if (name?.toLowerCase() === 'badges') {
            //     nm = 'badge ' + v?.name
            // } else if (name?.toLowerCase() === 'certificates') {
            //     nm = 'certificate ' + v?.name
            // } else if (name?.toLowerCase() === 'polls') {
            //     nm = 'poll ' + v?.name
            // } else if (name?.toLowerCase() === 'program') {
            //     nm = 'program ' + v?.name
            // } else if (name?.toLowerCase() === 'e cards') {
            //     nm = 'ecard ' + v?.name
            // } else if (name?.toLowerCase() === 'enlite wall') {
            //     nm = 'enlite Wall ' + v?.name
            // } else if (name?.toLowerCase() === 'survey') {
            //     nm = 'survey ' + v?.name
            // } else if (name?.toLowerCase() === 'forum') {
            //     nm = 'forum ' + v?.name
            // } else if (name?.toLowerCase() === 'ideas') {
            //     nm = 'ideabox ' + v?.name
            // }
            v?.child?.[0]?.child?.map(c => {
                const transformedSentence = convertToCamelCase(c?.name);
                //  transformSentence(c?.name);
                array[transformedSentence] = validate[c?.id]['read']
                // chilMapped(v?.child, v?.name)
            })
        })
    }
    chilMapped(GetPermissions ?? [])
    return array;
};

function convertToCamelCase(inputString) {
    // Split the input string into words
    const words = inputString.split(' ');

    // Convert the first word to lowercase
    words[0] = words[0].toLowerCase();

    // Capitalize the first letter of each subsequent word
    for (let i = 1; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].slice(1);
    }

    // Join the words back together
    const camelCaseString = words.join('');

    return camelCaseString;
}

function transformSentence(sentence) {
    const words = sentence.split(' ');
    const formattedWords = words.map((word, index) => {
        if (index === 0) {
            return word.charAt(0).toLowerCase() + word.slice(1);
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
    });
    return formattedWords.join('');
}


export const LoaderHandler = (arg) => {
    const element = document.getElementById('loader-container');
    element.classList.remove('d-none', 'd-block');

    if (arg === 'show') {
        element.classList.add('d-block');
    } else {
        element.classList.add('d-none');
    }
}

// export const idmRoleMappingRolesScreenAccess = async (data, permission = ['update', 'read', 'create', 'delete']) => {
//     const GetPermissions = data ?? []
//     var validate = validateAuthorization(getIds(GetPermissions), permission);
//     return { data: getPermission(GetPermissions, validate) }
// }