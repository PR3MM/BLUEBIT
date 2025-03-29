import React from 'react'
import Map from './Map'
import AddressProvider  from './context/AddressContext'

import Right from './Right'

const NearbyPharmacies = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <AddressProvider>
  <div className="p-4 h-screen">
      <Map />
    
  </div>
  <div className="p-4"> <Right/> 
  </div>
  </AddressProvider>
</div>

  )
}


export default NearbyPharmacies;
