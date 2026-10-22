/* Seed content for the Healthcare Project website. All data is local demo data. */

const SPECIALTIES = [
  { id: 'cardio',   name: 'Cardiologist',    icon: 'heart' },
  { id: 'derma',    name: 'Dermatologist',   icon: 'skin' },
  { id: 'pedia',    name: 'Pediatrician',    icon: 'child' },
  { id: 'ortho',    name: 'Orthopedist',     icon: 'bone' },
  { id: 'dental',   name: 'Dentist',         icon: 'tooth' },
  { id: 'gen',      name: 'General',         icon: 'stethoscope' },
];

const DOCTORS = [
  {
    id: 'samira-khouri',
    name: 'Dr. Samira Khouri',
    role: 'Cardiologist',
    hospital: 'Greenview Heart Center',
    location: 'Al Nasr District',
    rating: 4.9,
    reviews: 132,
    years: 12,
    patients: 1200,
    fee: 250,
    color: '#0B7285',
    fav: false,
    about:
      'Cardiology consultant focused on preventive heart care, arrhythmia follow-up and hypertensive patients. Graduated from Cairo Medical School in 2011 and rotating with Greenview Heart Center ever since.',
    education: [
      { year: '2015', line: 'Cardiology Fellowship — Greenview Heart Center' },
      { year: '2011', line: 'MD, Cairo Medical School (with first-class honours)' },
    ],
    working: { days: 'Mon · Wed · Fri', hours: '09:00 — 15:00', note: 'Room 3A, first floor' },
  },
  {
    id: 'omar-farid',
    name: 'Dr. Omar Farid',
    role: 'Dermatologist',
    hospital: 'Lakeside Skin Clinic',
    location: 'Lake View District',
    rating: 4.8,
    reviews: 97,
    years: 9,
    patients: 980,
    fee: 200,
    color: '#B45309',
    fav: true,
    about:
      'Dermatologist and laser-surgery specialist covering acne control, pigmentation and mole screening. Believes skin advice should be simple enough to follow at home.',
    education: [
      { year: '2017', line: 'Dermatology Residency — Lakeside Skin Clinic' },
      { year: '2014', line: 'MBBCh — Faculty of Medicine, Alexandria' },
    ],
    working: { days: 'Tue · Thu · Sat', hours: '11:00 — 17:00', note: 'Clinic B, lakeside wing' },
  },
  {
    id: 'hala-mansour',
    name: 'Dr. Hala Mansour',
    role: 'Pediatrician',
    hospital: 'Little Start Children’s Hospital',
    location: 'West Gate District',
    rating: 4.9,
    reviews: 210,
    years: 14,
    patients: 2600,
    fee: 180,
    color: '#7C3AED',
    fav: false,
    about:
      'Pediatrician for newborn care, growth follow-up and vaccination planning. Known for visits that end with calm kids instead of crying ones.',
    education: [
      { year: '2012', line: 'Pediatrics Board — Little Start Children’s Hospital' },
      { year: '2009', line: 'MBBCh — Faculty of Medicine, Helwan' },
    ],
    working: { days: 'Daily', hours: '10:00 — 18:00', note: 'Newborn unit, second floor' },
  },
  {
    id: 'tarek-zaki',
    name: 'Dr. Tarek Zaki',
    role: 'Orthopedist',
    hospital: 'Motion Orthopedic Institute',
    location: 'Al Nasr District',
    rating: 4.7,
    reviews: 85,
    years: 17,
    patients: 1900,
    fee: 300,
    color: '#155E75',
    fav: false,
    about:
      'Orthopedic surgeon specialised in sports medicine, knee and shoulder joints, plus post-operation physiotherapy planning.',
    education: [
      { year: '2010', line: 'Orthopedic Surgery Board — Motion Institute' },
      { year: '2006', line: 'MBBCh — Faculty of Medicine, Cairo' },
    ],
    working: { days: 'Sun · Tue', hours: '08:00 — 14:00', note: 'Surgical wing, room 12' },
  },
  {
    id: 'nour-adel',
    name: 'Dr. Nour Adel',
    role: 'Dentist',
    hospital: 'Bright Smile Dental Care',
    location: 'Central District',
    rating: 4.8,
    reviews: 156,
    years: 8,
    patients: 1100,
    fee: 150,
    color: '#0E7490',
    fav: false,
    about:
      'Cosmetic and general dentistry: cleaning, whitening, braces follow-up and gentle root-canal care for anxious patients.',
    education: [
      { year: '2018', line: 'Advanced Aesthetic Dentistry — Bright Smile Academy' },
      { year: '2015', line: 'BDS — Faculty of Dentistry, Cairo' },
    ],
    working: { days: 'Mon — Thu', hours: '12:00 — 20:00', note: 'Ground floor, suite 4' },
  },
  {
    id: 'mai-younes',
    name: 'Dr. Mai Younes',
    role: 'General',
    hospital: 'City Family Clinic',
    location: 'Central District',
    rating: 4.6,
    reviews: 240,
    years: 10,
    patients: 3400,
    fee: 100,
    color: '#9A3412',
    fav: false,
    about:
      'Family physician for everyday care: colds, diabetes follow-up, lab reading and annual checkups for the whole household.',
    education: [
      { year: '2016', line: 'Family Medicine Diploma — City Family Clinic' },
      { year: '2013', line: 'MBBCh — Faculty of Medicine, Mansoura' },
    ],
    working: { days: 'Daily', hours: '09:00 — 21:00', note: 'Walk-in welcome after 17:00' },
  },
];

const REVIEWS = {
  'samira-khouri': [
    { name: 'Yasmin H.', stars: 5, when: '2 days ago', text: 'Explained my ECG line by line and never rushed me. The follow-up plan fit my budget as well.' },
    { name: 'Karim S.', stars: 5, when: 'last week', text: 'Booked at 9:15, was seen at 9:20. Cleanest waiting room I have sat in.' },
    { name: 'Alia M.', stars: 4, when: '2 weeks ago', text: 'Great doctor, but weekday mornings are heavy on traffic outside the clinic.' },
  ],
  'omar-farid': [
    { name: 'Dina R.', stars: 5, when: 'yesterday', text: 'Skin routine was written down in plain steps and it actually worked.' },
    { name: 'Fady G.', stars: 4, when: 'last week', text: 'Honest about which treatments are worth it. No upselling.' },
  ],
  'hala-mansour': [
    { name: 'Mariam N.', stars: 5, when: '3 days ago', text: 'My 3-year-old asks to visit her. That alone says everything.' },
    { name: 'Sherif A.', stars: 5, when: 'last week', text: 'Vaccination schedule printed and explained in both languages.' },
  ],
};

const ARTICLES = [
  { id: 'a1', title: '10 minutes of walking after meals tames blood sugar', tag: 'Diabetes', read: '4 min' },
  { id: 'a2', title: 'How much water is “enough” on a summer weekday?', tag: 'Wellness', read: '3 min' },
  { id: 'a3', title: 'Snoring vs sleep apnea: when to book a test', tag: 'Sleep', read: '5 min' },
];

/* Booking slots — the same offer for every doctor, demo only. */
const SLOT_GROUPS = [
  { label: 'Morning',  slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
  { label: 'Afternoon', slots: ['13:00', '13:30', '14:00', '14:30'] },
  { label: 'Evening',  slots: ['17:00', '17:30', '18:00', '18:30', '19:00'] },
];

/* Deterministic pseudo-random busy slots, stable per day+doctor. */
function busySlots(doctorId, dayKey) {
  const busy = new Set();
  let seed = 0;
  const key = doctorId + dayKey;
  for (let i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
  SLOT_GROUPS.forEach((g, gi) =>
    g.slots.forEach((s, si) => {
      seed = (seed * 1103515245 + 12345) >>> 0;
      if ((seed >> 8) % 5 === 0) busy.add(s);
      void gi; void si;
    })
  );
  return busy;
}
