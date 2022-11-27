const bulacanInfo = `Region: Region III (Central Luzon)
Land Area: 278,369 has.
Population: 3,708,890.00
Number of Municipalities: 24 (3 Cities)
Number of Barangays: 569
Governor: Hon. Daniel R. Fernando
Vice Governor: Hon. Alex C. Castro
`;

const Info = () => {
  return (
    <div className="flex flex-col space-y-3 p-2">
      <div className="flex flex-col">
        <h1 className="text-lg font-extrabold">Bulacan Information</h1>
        <p className="whitespace-pre">{bulacanInfo}</p>
      </div>
      <div id="layer-info" className="flex flex-col border-t-2">
        <h1 className="text-lg font-extrabold">Map Information</h1>
        <span id="municipality"></span>
        <span id="population"></span>
        <span id="barangay"></span>
      </div>
    </div>
  );
};

export default Info;
