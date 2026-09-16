// Public, editable content. Source/approval decisions live in ../content-approvals.json.
export const site = {
  name: 'Abu Dhabi United Real Estate',
  email: 'Inquiries@adu-re.com',
  cities: ['Abu Dhabi', 'Dubai', 'Al Ain'],
  year: '2026',
  links: {find:'#discover', sell:'#contact', manage:'#management', enquiry:'#contact'},
  proof: {established:'2002', units:'3,000+', team:'200+', occupancy:'98%', vacancy:'1-2 Weeks', cities:'3'},
};

export const journeys = {
  buy: {image:'architecture-courtyard',alt:'Landscaped walkway beside curved residential buildings',body:'Choose with clarity. Discover opportunities with guidance grounded in the market.',cta:'Buy with ADURE',href:'#discover'},
  sell: {image:'architecture-waterfront',alt:'Waterfront apartments in warm evening light',body:'Position for the right value. Bring your property to market with considered positioning and the right audience.',cta:'Sell with ADURE',href:'#contact'},
  rent: {image:'architecture-terraces',alt:'Sunlit terraces overlooking an open residential courtyard',body:'Connect people with place. Create the right match between properties, owners and occupants.',cta:'Lease with ADURE',href:'#discover'},
  manage: {image:'architecture-palms',alt:'Sunlight through palms beside a carefully maintained facade',body:'Protect what comes next. Keep assets performing through connected, long-term management.',cta:'Property management',href:'#management'},
};

export const management = [
  {id:'leasing',title:'Leasing & operations',image:'architecture-palms',alt:'Palm-lined facade in the supplied portfolio',body:'Keeping occupancy, tenant relationships and everyday performance moving forward.',examples:['Leasing management','Lease administration & renewals','Rental assessment & market research','Regulatory compliance'],outcome:'A property that stays connected.'},
  {id:'facility',title:'Facility management',image:'architecture-windows',alt:'Rhythmic windows and sunshades on a residential facade',body:'Maintaining spaces with the consistency, care and attention they require.',examples:['Integrated facility management','Hard & soft FM','Maintenance & asset management','HSE, engineering & digital FM'],outcome:'Every detail, working together.'},
  {id:'financial',title:'Financial & legal management',image:'architecture-facade',alt:'Precisely arranged balconies and windows on a modern building',body:'Clear oversight, structured reporting and coordinated support around every asset.',examples:['Financial strategy & operations','Budgeting & forecasting','Periodic financial reporting','Legal & regulatory coordination'],outcome:'Clarity behind every decision.'},
];

// Editorial property directions that begin a conversation rather than claim availability.
export const collections = [
  {id:'waterfront',name:'Waterfront living',location:'Abu Dhabi',type:'Apartment',beds:[1,2,3],buy:['1m-3m','3m-plus'],rent:['100k-200k','200k-plus'],image:'architecture-waterfront',alt:'Evening light on curved balconies beside the sea'},
  {id:'city',name:'City connections',location:'Dubai',type:'Apartment',beds:[1,2],buy:['under-1m','1m-3m'],rent:['under-100k','100k-200k'],image:'architecture-city',alt:'A modern building with shaded windows on an urban street'},
  {id:'space',name:'Room to grow',location:'Al Ain',type:'Villa',beds:[3,4,5],buy:['1m-3m','3m-plus'],rent:['100k-200k','200k-plus'],image:'architecture-community',alt:'Low-rise homes and greenery under an evening sky'},
];
export function matchCollections(filters) {
  const beds=filters.beds??'any', budget=filters.budget??'any';
  return collections.filter(item =>
    (filters.location==='any'||item.location===filters.location) &&
    (filters.type==='any'||item.type===filters.type) &&
    (beds==='any'||item.beds.includes(Number(beds))||(beds==='4-plus'&&item.beds.some(value=>value>=4))) &&
    (budget==='any'||item[filters.intent].includes(budget))
  );
}
export const portfolio = [
  {id:'sunrise-residence-3',caption:'Sunrise Residence 3',detail:'Residential · Qaryat Al Hidd, Saadiyat Island',image:'portfolio-reference/sunrise-residence-3-v2',alt:'Sunrise Residence 3 at Qaryat Al Hidd, Saadiyat Island'},
  {id:'48-burj-gate',caption:'48 Burj Gate',detail:'Retail · Sheikh Zayed Road, Dubai',image:'portfolio-reference/48-burj-gate-v2',alt:'48 Burj Gate on Sheikh Zayed Road in Dubai'},
  {id:'qaryat-al-hidd',caption:'Qaryat Al Hidd',detail:'Residential · Saadiyat Island',image:'portfolio-reference/qaryat-al-hidd-v2',alt:'Qaryat Al Hidd waterfront community on Saadiyat Island'},
  {id:'al-mushrif-villas',caption:'Al Mushrif Villas',detail:'Residential · Al Mushrif, Abu Dhabi',image:'portfolio-reference/al-mushrif-villas-v2',alt:'Al Mushrif Villas in Abu Dhabi'},
  {id:'ghantoot-complex',caption:'Ghantoot Complex',detail:'Residential · Mohammed Bin Zayed City',image:'portfolio-reference/ghantoot-complex-v2',alt:'Ghantoot Complex residential community in Abu Dhabi'}
];
export const transition = [
  {title:'Review',week:'Week 1',body:'Understand the asset, its documentation and existing requirements.',gain:'A clear starting point, with responsibilities understood from the beginning.',evidence:['Property records','Lease documentation','Full handover audit'],next:'Inspect'},
  {title:'Inspect',week:'Week 2',body:'Assess the property, operations and tenant needs.',gain:'Visibility into the property’s condition and the needs of its tenants.',evidence:['Asset inspection','Tenant communication','Condition review'],next:'Takeover'},
  {title:'Takeover',week:'Week 3',body:'Bring responsibilities, communication and reporting into alignment.',gain:'An organised handover and a clear line of sight into operations.',evidence:['Operational takeover','Reporting setup','Service coordination'],next:'Manage'},
  {title:'Manage',week:'Week 4',body:'Move into ongoing oversight with clear accountability and visibility.',gain:'Ongoing oversight that keeps your property and its performance in view.',evidence:['Full management','Performance monitoring','Periodic reporting'],next:null},
];
// Add only logos with explicit website-use approval.
export const clients = [];
