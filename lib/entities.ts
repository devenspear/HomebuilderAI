export const entityConfig = {
  entities: [
    { name:'Floorplan', patterns:['plan','floorplan','fp-'], required_fields:['beds','baths','sqft','starting_price'] },
    { name:'Model', patterns:['model','home-model'], required_fields:['name','community','gallery'] },
    { name:'Lot', patterns:['lot','homesite'], required_fields:['lot_number','status','price','plan_compatibility'] }
  ],
  canonical: {
    floorplan: 'Plan-{PlanName}-{Beds}BR-{SqFt}sf',
    lot: 'Lot-{LotNumber}-{Community}-{Status}'
  }
}
