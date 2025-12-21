from dbfread import DBF
import csv

for file in ["ACCOUNTS.DBF","BILL.DBF",	"BRSTRANS.DBF",	"COMPSOC.DBF",	"FDREG.DBF",	"LEDGER.DBF",	"MEMOS.DBF",	"NO99.DBF",	"OLDACCT.DBF",	"TEMPVAL.DBF",	"VENDOR.DBF",	"WATERMET.DBF",	"WING.DBF", "ACCTINFO.DBF","BILLPART.DBF",	"CAMAST.DBF",	"CYMEMVAL.DBF",	"IFORM.DBF",	"LOCK.DBF",	"MEMVAL.DBF",	"NOTES.DBF",	"PAGELED.DBF",	"TRANSACT.DBF",	"WATERME1.DBF",	"WATERTMP.DBF"]:
    with open(file.replace('.DBF', '.csv'), 'w', newline='') as f:
        writer = csv.writer(f)
        db = DBF(file)
        writer.writerow(db.field_names)
        for record in db:
            writer.writerow(list(record.values()))