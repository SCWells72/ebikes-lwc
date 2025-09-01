public with sharing class ProductRecordInfoController {
    @AuraEnabled(Cacheable=true Scope='global')
    public static List<String> getRecordInfo(String productOrFamilyName) {
        List<String> recordInfo = new List<String>();

        List<Product__c> cProductList = [
            SELECT Id
            FROM Product__c
            WHERE Name = :productOrFamilyName
            WITH USER_MODE
        ];
        if (cProductList.size() > 0) {
            recordInfo.add(cProductList[0].Id);
            recordInfo.add('Product__c');
            return recordInfo;
        }

        List<Product_Family__c> cProductFamilyList = [
            SELECT Id
            FROM Product_Family__c
            WHERE Name = :productOrFamilyName
            WITH USER_MODE
        ];
        if (cProductFamilyList.size() > 0) {
            recordInfo.add(cProductFamilyList[0].Id);
            recordInfo.add('Product_Family__c');
            return recordInfo;
        }
        return null;
    }
}
