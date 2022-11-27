interface propProps {
  key: string;
}

const info = (props: string) => {
  const id: propProps = {
    key: props,
  };

  const municipalities = {
    '530': {
      data: {
        name: 'Doña Remedios Trinidad',
        population: '28,656',
        barangay: '8',
      },
    },
    '1331': {
      data: {
        name: 'San Miguel',
        population: '172,073',
        barangay: '49',
      },
    },
    '1285': {
      data: { name: 'San Ildefonso', population: '115,713', barangay: '36' },
    },
    '1353': {
      data: { name: 'San Rafael', population: '103,097', barangay: '34' },
    },
    '61': { data: { name: 'Angat', population: '65,617', barangay: '16' } },
    '1026': {
      data: { name: 'Norzagaray', population: '136,064', barangay: '13' },
    },
    '137': { data: { name: 'Baliuag', population: '168,470', barangay: '27' } },
    '417': {
      data: {
        name: 'City of San Jose Del Monte',
        population: '651,813',
        barangay: '59',
      },
    },
    '1396': {
      data: { name: 'Santa Maria', population: '289,820', barangay: '24' },
    },
    '1085': { data: { name: 'Pandi', population: '155,115', barangay: '22' } },
    '266': { data: { name: 'Bustos', population: '77,199', barangay: '14' } },
    '1183': {
      data: { name: 'Pulilan', population: '108,836', barangay: '19' },
    },
    '1153': {
      data: { name: 'Plaridel', population: '114,432', barangay: '19' },
    },
    '598': {
      data: { name: 'Guiguinto', population: '113,415', barangay: '14' },
    },
    '118': { data: { name: 'Balagtas', population: '77,018', barangay: '9' } },
    '942': { data: { name: 'Marilao', population: '254,453', barangay: '16' } },
    '217': { data: { name: 'Bocaue', population: '141,412', barangay: '19' } },
    '407': {
      data: {
        name: 'City of Meycauayan',
        population: '225,673',
        barangay: '26',
      },
    },
    '1033': { data: { name: 'Obando', population: '59,978', barangay: '11' } },
    '249': { data: { name: 'Bulakan', population: '114,432', barangay: '14' } },
    '402': {
      data: { name: 'City of Malolos', population: '261,189', barangay: '51' },
    },
    '311': {
      data: { name: 'Calumpit', population: '118,471', barangay: '29' },
    },
    '613': { data: { name: 'Hagonoy', population: '133,448', barangay: '26' } },
    '1101': {
      data: { name: 'Paombong', population: '55,696', barangay: '14' },
    },
  };

  const municipalitiesData =
    municipalities[id.key as keyof typeof municipalities]['data'];

  return {
    municipality: municipalitiesData['name'],
    population: municipalitiesData['population'],
    barangay: municipalitiesData['barangay'],
  };
};

export default info;
