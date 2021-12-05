try{
    const Map = require('../cbs/Map')
    let map = new Map(1,1,{})
    map.readMap('./maps/kiva.map')
    console.log(map.grid)
}
catch (err){
    console.log(__dirname)
    console.log(`Error: ${err}`)
}

