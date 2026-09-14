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
  buy: {image:'architecture-courtyard',alt:'Landscaped walkway beside curved residential buildings',body:'Find the right property with clear information and informed guidance.',cta:'Buy With ADURE',href:'#discover'},
  sell: {image:'architecture-waterfront',alt:'Waterfront apartments in warm evening light',body:'Bring your property to market with professional advice, strong exposure and access to qualified buyers.',cta:'Sell With ADURE',href:'#contact'},
  rent: {image:'architecture-terraces',alt:'Sunlit terraces overlooking an open residential courtyard',body:'Find a residential or commercial property that fits what you need next.',cta:'Rent With ADURE',href:'#discover'},
  manage: {image:'architecture-palms',alt:'Sunlight through palms beside a carefully maintained facade',body:'Bring your asset under one connected management approach, with leasing, operations, facilities, finance and legal oversight working together.',cta:'Property Management',href:'#management'},
};

export const management = [
  {id:'leasing',title:'Leasing & Operations',image:'architecture-palms',alt:'Palm-lined facade in the supplied portfolio',body:'From market assessment and tenant sourcing to administration, renewals and regulatory compliance.',examples:['Leasing management','Lease administration & renewals','Rental assessment & market research','Regulatory compliance'],outcome:'A property that stays connected.'},
  {id:'facility',title:'Facility Management',image:'architecture-windows',alt:'Rhythmic windows and sunshades on a residential facade',body:'Technical, operational and support services that keep properties safe, efficient and reliable.',examples:['Integrated facility management','Hard & soft FM','Maintenance & asset management','HSE, engineering & digital FM'],outcome:'Every detail, working together.'},
  {id:'financial',title:'Financial & Legal Management',image:'architecture-facade',alt:'Precisely arranged balconies and windows on a modern building',body:'Structured financial oversight, reporting and legal coordination that give owners greater visibility and control.',examples:['Financial strategy & operations','Budgeting & forecasting','Periodic financial reporting','Legal & regulatory coordination'],outcome:'Clarity behind every decision.'},
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
  {id:'waterfront',caption:'Waterfront rhythm',detail:'Architecture shaped by its surroundings.',image:'architecture-waterfront',alt:'Curved waterfront balconies warmed by the evening sun'},
  {id:'curves',caption:'A different perspective',detail:'Sculptural forms, seen from the ground.',image:'architecture-curves',alt:'Curved residential building with layered white terraces'},
  {id:'facade',caption:'Order in the detail',detail:'A closer look at the building fabric.',image:'architecture-facade',width:1333,height:723,alt:'Repeating windows and balconies create a geometric facade'},
  {id:'courtyard',caption:'Space to connect',detail:'Landscape and architecture in conversation.',image:'architecture-courtyard',alt:'A landscaped pedestrian route through a residential development'},
  {id:'horizon',caption:'An open outlook',detail:'A view beyond the everyday.',image:'architecture-horizon',alt:'A glimpse of the sea between two residential buildings'},
];
export const transition = [
  {title:'Review',week:'Week 1',body:'Property and document review, with a full handover audit.',gain:'A clear starting point, with responsibilities understood from the beginning.',evidence:['Property records','Lease documentation','Full handover audit'],next:'Inspect'},
  {title:'Inspect',week:'Week 2',body:'Asset inspection and tenant communication.',gain:'Visibility into the property’s condition and the needs of its tenants.',evidence:['Asset inspection','Tenant communication','Condition review'],next:'Takeover'},
  {title:'Takeover',week:'Week 3',body:'Operational takeover and reporting setup.',gain:'An organised handover and a clear line of sight into operations.',evidence:['Operational takeover','Reporting setup','Service coordination'],next:'Manage'},
  {title:'Manage',week:'Week 4+',body:'Full management, reporting and performance monitoring.',gain:'Ongoing oversight that keeps your property and its performance in view.',evidence:['Full management','Performance monitoring','Periodic reporting'],next:null},
];
// Add only logos with explicit website-use approval.
export const clients = [];
