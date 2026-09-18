export const reference='https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final';
export const properties=[
 {id:'ADU-304',title:'Two-bedroom waterfront apartment',place:'Hidd Al Saadiyat',location:'Abu Dhabi',type:'Apartment',beds:2,price:145000,intent:'lease',facts:'2 beds · 3 baths · 1,420 sq ft',contact:'Hidd Al Saadiyat team',image:'hidd-al-saadiyat/golden-waterfront.webp',amenities:['Parking','Balcony','Swimming Pool','Gym','24/7 Security']},
 {id:'ADU-002',title:'Modern one-bedroom residence',place:'Al Khalidiyah · Abu Dhabi',location:'Abu Dhabi',type:'Apartment',beds:1,price:82000,intent:'lease',facts:'1 bed · 2 baths · 860 sq ft',contact:'Abu Dhabi team',image:'architecture-courtyard.webp',amenities:['Parking','Balcony','Gym']},
 {id:'ADU-003',title:'Commercial office with city access',place:'Airport Street · Abu Dhabi',location:'Abu Dhabi',type:'Commercial',beds:null,price:190000,intent:'lease',facts:'Office · 2,100 sq ft',contact:'Abu Dhabi team',image:'architecture-facade.webp',amenities:['Parking','24/7 Security']},
 {id:'ADU-004',title:'Family three-bedroom apartment',place:'Al Mushrif · Abu Dhabi',location:'Abu Dhabi',type:'Apartment',beds:3,price:2450000,intent:'buy',facts:'3 beds · 4 baths · 1,760 sq ft',contact:'Abu Dhabi team',image:'architecture-terraces.webp',amenities:['Parking','Balcony','Pet Friendly']},
 {id:'ADU-005',title:'Retail unit in active neighbourhood',place:'Dubai',location:'Dubai',type:'Commercial',beds:null,price:310000,intent:'lease',facts:'Retail · 1,180 sq ft',contact:'Dubai team',image:'architecture-community.webp',amenities:['Parking','24/7 Security']},
 {id:'ADU-006',title:'Waterfront studio residence',place:'Hidd Al Saadiyat',location:'Abu Dhabi',type:'Apartment',beds:0,price:68000,intent:'lease',facts:'Studio · 1 bath · 540 sq ft',contact:'Hidd Al Saadiyat team',image:'hidd-al-saadiyat/curved-residences.webp',amenities:['Swimming Pool','Gym','24/7 Security']}
];
// IDs after ADU-304 are local stable keys, not advertised property references.
// Amenity tags are illustrative data for these demo listings, pending verified property details.
export function matchProperties(filters){return properties.filter(p=>
 (!filters.intent||p.intent===filters.intent)&&
 (!filters.location||filters.location==='All locations'||p.location===filters.location)&&
 (!filters.type||filters.type==='All types'||p.type===filters.type)&&
 (!filters.bedrooms||filters.bedrooms==='Any bedrooms'||(filters.bedrooms==='Studio'?p.beds===0:filters.bedrooms==='1–2 bedrooms'?p.beds>=1&&p.beds<=2:p.beds>=3))&&
 (!filters.price||filters.price==='Any price'||(filters.price==='Under AED 100K'?p.price<100000:filters.price==='AED 100K–200K'?p.price>=100000&&p.price<=200000:p.price>200000))&&
 (!filters.amenities?.length||filters.amenities.every(amenity=>p.amenities.includes(amenity)))
 );}
