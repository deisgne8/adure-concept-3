import {portfolio} from './content.js';

// Approved assets must be added here only after identity, photo and geography approval.
export const approvedProperties = [];
export const modelReference = {
  geographicOrigin: null, units: 'illustrative model units', scale: null,
  axes: {x:'model east', y:'up', z:'model south'},
  notice: 'Illustrative map — locations to be confirmed.',
};
const study = (city, source, position, form) => ({
  id: `${city}-${source.id}`, name: source.caption, city,
  neighbourhood: 'Location unconfirmed', category: 'Category unconfirmed',
  latitude: null, longitude: null, modelNodeId: `${city}-${source.id}`,
  scenePosition: position, form, image: `assets/${source.image}.webp`, alt: source.alt,
  shortDescription: source.detail, detailUrl: null, dataStatus: 'demo',
  cameraPreset: {target:[position[0], 0, position[2]], zoom:1.65},
});
// These are editorial image studies, not named properties or claimed city associations.
export const demoProperties = [
  study('abu-dhabi',portfolio[0],[-27,0,9],'terraces'),
  study('abu-dhabi',portfolio[3],[5,0,-14],'courtyard'),
  study('abu-dhabi',portfolio[1],[33,0,9],'tower'),
  study('dubai',portfolio[2],[-26,0,-12],'tower'),
  study('dubai',portfolio[1],[7,0,10],'terraces'),
  study('dubai',portfolio[4],[34,0,-14],'tower'),
  study('al-ain',portfolio[3],[-27,0,9],'courtyard'),
  study('al-ain',portfolio[2],[5,0,-14],'courtyard'),
  study('al-ain',portfolio[1],[33,0,9],'terraces'),
];
export const cities = [
  {id:'abu-dhabi',name:'Abu Dhabi',number:'01',type:'coast',seed:41,angle:0.55,overview:{target:[0,0,0],zoom:1}},
  {id:'dubai',name:'Dubai',number:'02',type:'canal',seed:73,angle:0.55,overview:{target:[0,0,0],zoom:1}},
  {id:'al-ain',name:'Al Ain',number:'03',type:'garden',seed:97,angle:0.55,overview:{target:[0,0,0],zoom:1}},
];
export const propertiesForCity = id => demoProperties.filter(property=>property.city===id);
