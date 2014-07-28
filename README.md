demo for use node-orm2 with some db structure, not for production, only experimental

### installation
	npm install

### run
	node app mysql://username:password@db.example.com/somedb


### example output
```
[ { payment_id: 255,
    payment_variable: 1300000246,
    payment_issue: Wed Jul 17 2013 13:54:31 GMT+0000 (UTC),
    vouchers: 
     [ { deal_purchase_id: 218,
         payment_id: 255,
         deal_purchase_email: 'email@example.com',
         purchaseVariants: 
          [ { deal_purchase_has_deal_variant_id: 215,
              deal_purchase_id: 218,
              deal_id: 7032,
              deal_variant_id: 9836,
              deal: 
               { deal_id: 7032,
                 deal_title_newsletter_cs: 'Otvírák s počítadlem' },
              variant: 
               { deal_variant_id: 9836,
                 deal_id: 7032,
                 deal_variant_title_cs: 'Otvírák na lahve s počítadlem',
                 deal: 
                  { deal_id: 7032,
                    deal_title_newsletter_cs: 'Otvírák s počítadlem' } } } ] } ] } ]
```
