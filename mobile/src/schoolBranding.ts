// Static branding for the two schools. These are fixed identities (matching
// schema.sql's seeded `schools` rows), bundled locally so logos render even
// offline and without any backend/API changes.

export interface SchoolBrand {
  code: 'primary' | 'secondary';
  name: string;
  shortName: string;
  motto: string;
  logo: number; // require() result
  address: string;
  phone: string; // comma-separated if more than one number
}

export const SCHOOL_BRANDS: Record<string, SchoolBrand> = {
  secondary: {
    code: 'secondary',
    name: 'Sow the Seed Model College',
    shortName: 'Model College',
    motto: 'We all shall be taught of God. John 6:45',
    logo: require('../assets/branding/logo-secondary-model-college.png'),
    address: 'Olosan Road, Alakia',
    phone: '08033269042, 08138044735',
  },
  primary: {
    code: 'primary',
    name: 'Sow the Seed Nursery & Primary School',
    shortName: 'Nursery & Primary',
    motto: 'Growing in Wisdom and finding favour with God and Man. (Luke 2:52)',
    logo: require('../assets/branding/logo-primary-nur-pry.png'),
    // TODO(Grace): placeholder — same as Model College's until you confirm
    // the primary school's actual address/phone for the report header.
    address: 'Olosan Road, Alakia',
    phone: '08033269042, 08138044735',
  },
};

/** Returns the brand for a school_code, or null if it doesn't map to a known school (e.g. admin with no school_code). */
export function getSchoolBrand(schoolCode?: string | null): SchoolBrand | null {
  if (!schoolCode) return null;
  return SCHOOL_BRANDS[schoolCode] ?? null;
}
