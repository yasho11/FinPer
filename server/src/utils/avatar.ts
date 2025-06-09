export const getAvatarByGender = (gender: string): string => {
    switch (gender){
      case 'male':
      return 'https://avatar.iran.liara.run/public/boy';
    case 'female':
      return 'https://avatar.iran.liara.run/public/girl';
    default:
      return 'https://avatar.iran.liara.run/public';
    }
}