export type Board = 'CBSE' | 'Kerala State' | 'ICSE';
export type Stream = 'Science' | 'Commerce' | 'Humanities' | 'Vocational';
export type Medium = 'English' | 'Malayalam' | 'Both';
export type SchoolLevel = 'High School' | 'Higher Secondary';

export interface School {
  id: number;
  slug: string;
  name: string;
  town: string;
  district: string;
  board: Board[];
  streams: Stream[];
  medium: Medium;
  type: 'Government' | 'Aided' | 'Unaided' | 'Central';
  level: SchoolLevel;
  established: number;
  classes: string;
  affiliation?: string;
  description: string;
  address: string;
  plusTwo: boolean;
  features: string[];
}

// Sorted alphabetically by town, then by type (Government → Aided → Unaided → Central)
export const schools: School[] = [

  // ── ANTHIKAD ─────────────────────────────────────────────
  {
    id: 1, slug: 'ghss-anthikad',
    name: 'Government Higher Secondary School, Anthikad',
    town: 'Anthikad', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Humanities'],
    medium: 'Malayalam', type: 'Government', level: 'Higher Secondary',
    established: 1974, classes: '8-12',
    description: 'Government higher secondary school serving the Anthikad panchayath with Science and Humanities streams at Plus Two level.',
    address: 'Anthikad, Thrissur, Kerala 680641',
    plusTwo: true,
    features: ['Science Lab', 'Library', 'Sports Ground', 'NSS'],
  },

  // ── CHAVAKKAD ────────────────────────────────────────────
  {
    id: 2, slug: 'ghss-chavakkad',
    name: 'Government Higher Secondary School, Chavakkad',
    town: 'Chavakkad', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce', 'Humanities'],
    medium: 'Malayalam', type: 'Government', level: 'Higher Secondary',
    established: 1957, classes: '8-12',
    description: 'One of the oldest government schools in Chavakkad municipality, with all three major Plus Two streams and a strong academic record.',
    address: 'Chavakkad, Thrissur, Kerala 680506',
    plusTwo: true,
    features: ['Science Lab', 'Computer Lab', 'Library', 'Sports Ground', 'NCC', 'NSS'],
  },
  {
    id: 3, slug: 'snm-hss-chavakkad',
    name: 'SNM Higher Secondary School, Chavakkad',
    town: 'Chavakkad', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce'],
    medium: 'Malayalam', type: 'Aided', level: 'Higher Secondary',
    established: 1963, classes: '8-12',
    description: 'SNM aided school in Chavakkad with strong Science and Commerce streams, managed by the SNM Education Trust.',
    address: 'Chavakkad, Thrissur, Kerala 680506',
    plusTwo: true,
    features: ['Science Lab', 'Computer Lab', 'Library', 'Sports'],
  },
  {
    id: 4, slug: 'st-josephs-hss-chavakkad',
    name: "St. Joseph's Higher Secondary School, Chavakkad",
    town: 'Chavakkad', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce', 'Humanities'],
    medium: 'Both', type: 'Aided', level: 'Higher Secondary',
    established: 1955, classes: '5-12',
    description: "Catholic aided school in Chavakkad offering Malayalam and English medium with all three Plus Two streams.",
    address: 'Chavakkad, Thrissur, Kerala 680506',
    plusTwo: true,
    features: ['Science Lab', 'Computer Lab', 'Chapel', 'Library', 'Arts Club', 'Sports'],
  },
  {
    id: 5, slug: 'kendriya-vidyalaya-chavakkad',
    name: 'Kendriya Vidyalaya, Chavakkad',
    town: 'Chavakkad', district: 'Thrissur',
    board: ['CBSE'], streams: ['Science', 'Commerce'],
    medium: 'English', type: 'Central', level: 'Higher Secondary',
    established: 1985, classes: '1-12',
    affiliation: 'CBSE',
    description: 'Central government school following CBSE curriculum with English medium instruction, well-equipped labs and a strong track record in board exams.',
    address: 'Chavakkad, Thrissur, Kerala 680506',
    plusTwo: true,
    features: ['Science Lab', 'Computer Lab', 'Sports', 'Library', 'Swimming Pool'],
  },
  {
    id: 6, slug: 'mount-carmel-school-chavakkad',
    name: 'Mount Carmel School, Chavakkad',
    town: 'Chavakkad', district: 'Thrissur',
    board: ['CBSE'], streams: ['Science', 'Commerce'],
    medium: 'English', type: 'Unaided', level: 'Higher Secondary',
    established: 1990, classes: '1-12',
    affiliation: 'CBSE',
    description: 'Unaided CBSE school in Chavakkad known for disciplined academics and strong Science stream performance at Plus Two.',
    address: 'Chavakkad, Thrissur, Kerala 680506',
    plusTwo: true,
    features: ['Computer Lab', 'Science Lab', 'Sports Ground', 'Library'],
  },

  // ── ENGANDIYUR ───────────────────────────────────────────
  {
    id: 7, slug: 'ghss-engandiyur',
    name: 'Government Higher Secondary School, Engandiyur',
    town: 'Engandiyur', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce', 'Humanities'],
    medium: 'Malayalam', type: 'Government', level: 'Higher Secondary',
    established: 1969, classes: '8-12',
    description: 'Government higher secondary school in Engandiyur serving the local community with all major Plus Two streams.',
    address: 'Engandiyur, Thrissur, Kerala 680615',
    plusTwo: true,
    features: ['Science Lab', 'Library', 'Sports Ground', 'NSS'],
  },
  {
    id: 8, slug: 'aided-hs-engandiyur',
    name: 'PMNM Higher Secondary School, Engandiyur',
    town: 'Engandiyur', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Humanities'],
    medium: 'Malayalam', type: 'Aided', level: 'Higher Secondary',
    established: 1972, classes: '8-12',
    description: 'Aided higher secondary school in Engandiyur with Science and Humanities streams, affiliated to the Kerala State Board.',
    address: 'Engandiyur, Thrissur, Kerala 680615',
    plusTwo: true,
    features: ['Lab', 'Library', 'Sports Ground'],
  },

  // ── KANDASSANKADAVU ──────────────────────────────────────
  {
    id: 9, slug: 'ghss-kandassankadavu',
    name: 'Government Higher Secondary School, Kandassankadavu',
    town: 'Kandassankadavu', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce', 'Humanities'],
    medium: 'Malayalam', type: 'Government', level: 'Higher Secondary',
    established: 1971, classes: '8-12',
    description: 'Government school in Kandassankadavu offering Plus Two in Science, Commerce and Humanities to students from the surrounding coastal panchayaths.',
    address: 'Kandassankadavu, Thrissur, Kerala 680613',
    plusTwo: true,
    features: ['Science Lab', 'Library', 'Sports Ground', 'NSS'],
  },

  // ── KANJANI ──────────────────────────────────────────────
  {
    id: 10, slug: 'ghs-kanjani',
    name: 'Government High School, Kanjani',
    town: 'Kanjani', district: 'Thrissur',
    board: ['Kerala State'], streams: [],
    medium: 'Malayalam', type: 'Government', level: 'High School',
    established: 1968, classes: '8-10',
    description: 'Government high school in Kanjani offering classes up to Class 10 under the Kerala State Board.',
    address: 'Kanjani, Thrissur, Kerala 680614',
    plusTwo: false,
    features: ['Library', 'Sports Ground', 'NSS'],
  },

  // ── NATTIKA ──────────────────────────────────────────────
  {
    id: 11, slug: 'ghss-nattika',
    name: 'Government Higher Secondary School, Nattika',
    town: 'Nattika', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Humanities'],
    medium: 'Malayalam', type: 'Government', level: 'Higher Secondary',
    established: 1966, classes: '8-12',
    description: 'Government higher secondary school near the Nattika beach, serving the fishing community and surrounding villages with Science and Humanities streams.',
    address: 'Nattika, Thrissur, Kerala 680566',
    plusTwo: true,
    features: ['Science Lab', 'Library', 'Sports Ground', 'Eco Club', 'NSS'],
  },
  {
    id: 12, slug: 'aided-hss-nattika',
    name: 'St. Thomas Higher Secondary School, Nattika',
    town: 'Nattika', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce'],
    medium: 'Malayalam', type: 'Aided', level: 'Higher Secondary',
    established: 1960, classes: '5-12',
    description: 'Christian aided school in Nattika with a long tradition of service to the coastal community, offering Science and Commerce at Plus Two level.',
    address: 'Nattika, Thrissur, Kerala 680566',
    plusTwo: true,
    features: ['Lab', 'Chapel', 'Library', 'Sports Ground'],
  },

  // ── THALIKULAM ───────────────────────────────────────────
  {
    id: 13, slug: 'ghss-thalikulam',
    name: 'Government Higher Secondary School, Thalikulam',
    town: 'Thalikulam', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce', 'Humanities'],
    medium: 'Malayalam', type: 'Government', level: 'Higher Secondary',
    established: 1964, classes: '8-12',
    description: 'Government higher secondary school in Thalikulam, on the Chavakkad–Kodungallur coastal route, with all three major Plus Two streams.',
    address: 'Thalikulam, Thrissur, Kerala 680569',
    plusTwo: true,
    features: ['Science Lab', 'Computer Lab', 'Library', 'Sports Ground', 'NSS'],
  },
  {
    id: 14, slug: 'snhss-thalikulam',
    name: 'SNM Higher Secondary School, Thalikulam',
    town: 'Thalikulam', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce'],
    medium: 'Malayalam', type: 'Aided', level: 'Higher Secondary',
    established: 1970, classes: '8-12',
    description: 'SNM aided school in Thalikulam offering Science and Commerce streams at Plus Two level.',
    address: 'Thalikulam, Thrissur, Kerala 680569',
    plusTwo: true,
    features: ['Lab', 'Library', 'Sports Ground'],
  },

  // ── THRITHALLOOR ─────────────────────────────────────────
  {
    id: 15, slug: 'ghss-thrithalloor',
    name: 'Government Higher Secondary School, Thrithalloor',
    town: 'Thrithalloor', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Humanities'],
    medium: 'Malayalam', type: 'Government', level: 'Higher Secondary',
    established: 1973, classes: '8-12',
    description: 'Government higher secondary school in Thrithalloor, a quiet panchayath near Vatanappally, offering Science and Humanities at Plus Two level.',
    address: 'Thrithalloor, Thrissur, Kerala 680619',
    plusTwo: true,
    features: ['Science Lab', 'Library', 'Sports Ground', 'NSS'],
  },

  // ── TRIPRAYAR (THRIPRAYAR) ───────────────────────────────
  {
    id: 16, slug: 'ghss-triprayar',
    name: 'Government Higher Secondary School, Triprayar',
    town: 'Triprayar', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce', 'Humanities'],
    medium: 'Malayalam', type: 'Government', level: 'Higher Secondary',
    established: 1962, classes: '8-12',
    description: 'Government higher secondary school in the temple town of Triprayar, offering all three Plus Two streams to students from across the panchayath.',
    address: 'Triprayar, Thrissur, Kerala 680566',
    plusTwo: true,
    features: ['Science Lab', 'Computer Lab', 'Library', 'Sports Ground', 'NSS'],
  },
  {
    id: 17, slug: 'sacred-heart-hss-triprayar',
    name: 'Sacred Heart Higher Secondary School, Triprayar',
    town: 'Triprayar', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce', 'Humanities'],
    medium: 'Both', type: 'Aided', level: 'Higher Secondary',
    established: 1955, classes: '1-12',
    description: 'Catholic aided school near the Thrissur Pooram circuit, offering Malayalam and English medium with all three Plus Two streams. Strong in arts and sports.',
    address: 'Triprayar, Thrissur, Kerala 680566',
    plusTwo: true,
    features: ['Labs', 'Chapel', 'Sports Ground', 'Arts Club', 'Library', 'Computer Lab'],
  },

  // ── VALAPAD ──────────────────────────────────────────────
  {
    id: 18, slug: 'ghss-valapad',
    name: 'Government Higher Secondary School, Valapad',
    town: 'Valapad', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce', 'Humanities'],
    medium: 'Malayalam', type: 'Government', level: 'Higher Secondary',
    established: 1967, classes: '8-12',
    description: 'Government higher secondary school in Valapad, the coastal panchayath near Nattika beach, offering all three major Plus Two streams.',
    address: 'Valapad, Thrissur, Kerala 680567',
    plusTwo: true,
    features: ['Science Lab', 'Library', 'Sports Ground', 'Eco Club', 'NSS'],
  },
  {
    id: 19, slug: 'mths-valapad',
    name: 'Mannam Thilakan Higher Secondary School, Valapad',
    town: 'Valapad', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Humanities'],
    medium: 'Malayalam', type: 'Aided', level: 'Higher Secondary',
    established: 1969, classes: '8-12',
    description: 'Aided higher secondary school in Valapad named after the social reformer Mannam, serving the coastal community with Science and Humanities streams.',
    address: 'Valapad, Thrissur, Kerala 680567',
    plusTwo: true,
    features: ['Lab', 'Library', 'Sports Ground'],
  },

  // ── VATANAPPALLY ─────────────────────────────────────────
  {
    id: 20, slug: 'ghss-vatanappally',
    name: 'Government Higher Secondary School, Vatanappally',
    town: 'Vatanappally', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce', 'Humanities'],
    medium: 'Malayalam', type: 'Government', level: 'Higher Secondary',
    established: 1954, classes: '1-12',
    description: 'One of the oldest government schools in Vatanappally with a strong academic tradition, active NSS unit and a well-equipped science laboratory.',
    address: 'Vatanappally, Thrissur, Kerala 680614',
    plusTwo: true,
    features: ['Computer Lab', 'Science Lab', 'Library', 'Sports Ground', 'NSS'],
  },
  {
    id: 21, slug: 'snm-hss-moothakunnam',
    name: 'SNM Higher Secondary School, Moothakunnam',
    town: 'Vatanappally', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce'],
    medium: 'Malayalam', type: 'Aided', level: 'Higher Secondary',
    established: 1975, classes: '8-12',
    description: 'SNM aided school in Moothakunnam near Vatanappally, with strong Science and Commerce streams producing many engineering and medical entrance qualifiers.',
    address: 'Moothakunnam, Vatanappally, Thrissur, Kerala 680614',
    plusTwo: true,
    features: ['Science Lab', 'Computer Lab', 'Library'],
  },
  {
    id: 22, slug: 'holy-family-hss-peravoor',
    name: 'Holy Family Higher Secondary School, Peravoor',
    town: 'Vatanappally', district: 'Thrissur',
    board: ['Kerala State'], streams: ['Science', 'Commerce', 'Humanities'],
    medium: 'Malayalam', type: 'Aided', level: 'Higher Secondary',
    established: 1958, classes: '8-12',
    description: 'Catholic aided school in Peravoor within the Vatanappally panchayath, with decades of service to the local community.',
    address: 'Peravoor, Vatanappally, Thrissur, Kerala 680614',
    plusTwo: true,
    features: ['Lab', 'Library', 'Chapel', 'Sports Ground'],
  },
];

export const towns = [
  'Anthikad',
  'Chavakkad',
  'Engandiyur',
  'Kandassankadavu',
  'Kanjani',
  'Nattika',
  'Thalikulam',
  'Thrithalloor',
  'Triprayar',
  'Valapad',
  'Vatanappally',
] as const;

export type Town = typeof towns[number];
