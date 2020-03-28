dataDir:"D:/data/cboe/daily_volume/";
srcDir:"C:/Users/david/workspace/git/usdv/src/";
system "cd ",dataDir;

years:2020-til 10;
fnames: ":daily_volume_" ,/: (string years) ,\: ".csv";
cboeDaily:raze 0:[("DSFFFFFFFFJJJJ"; enlist ",")] each `$fnames;
cnames:`date`sym`tapeAShares`tapeBShares`tapeCShares`totalShares`tapeANotional`tapeBNotional`tapeCNotional`totalNotional`tapeATradeCount`tapeBTradeCount`tapeCTradeCount`totalTradeCount;
cboeDaily:cnames xcol cboeDaily;
trfs:(`$"ADF (D)";`$"NSX (DC)";`$"NASDAQ (DQ)";`$"Nasdaq (DQ)";`$"NYSE (DN)";`$"TRF (D)";`$"FINRA / Nasdaq TRF Chicago (DB)";`$"FINRA / NYSE TRF (DN)";`$"FINRA / Nasdaq TRF Carteret (DQ)");
cboeDaily:update sym:`$"NYSE" from cboeDaily where sym=`$"NYSE (N)";
cboeDaily:update sym:`$"NYSE Arca" from cboeDaily where sym=`$"NYSE Arca (P)";
cboeDaily:update sym:`$"NYSE National" from cboeDaily where sym in (`$"NSX (C)";`$"NYSE National (C)");
cboeDaily:update sym:`$"NYSE American" from cboeDaily where sym in (`$"AMEX (A)";`$"NYSE MKT (A)";`$"NYSE American (A)");
cboeDaily:update sym:`$"NYSE Chicago" from cboeDaily where sym in (`$"CHX (M)";`$"NYSE Chicago (M)");
cboeDaily:update sym:`$"CBOE" from cboeDaily where sym in (`$"CBSX (W)";`$"CBOE (W)");
cboeDaily:update sym:`$"CBOE BYX" from cboeDaily where sym in (`$"BATS BYX (Y)";`$"BYX Equities (Y)");
cboeDaily:update sym:`$"CBOE BZX" from cboeDaily where sym in (`$"BATS BZX (Z)";`$"BATS (Z)";`$"BZX Equities (Z)");
cboeDaily:update sym:`$"CBOE EDGA" from cboeDaily where sym in (`$"EDGA (J)";`$"BATS EDGA (J)";`$"EDGA Equities (J)");
cboeDaily:update sym:`$"CBOE EDGX" from cboeDaily where sym in (`$"EDGX (K)";`$"BATS EDGX (K)";`$"EDGX Equities (K)");
cboeDaily:update sym:`$"NASDAQ" from cboeDaily where sym in (`$"NASDAQ (Q)";`$"Nasdaq (Q)");
cboeDaily:update sym:`$"NASDAQ ISE" from cboeDaily where sym=`$"ISE (I)";
cboeDaily:update sym:`$"NASDAQ BX" from cboeDaily where sym in (`$"BEX (B)";`$"NASDAQ BX (B)");
cboeDaily:update sym:`$"NASDAQ PSX" from cboeDaily where sym in (`$"PSX (X)";`$"NASDAQ PSX (X)";`$"NASDAQ PSX (X)";`$"PHLX (X)");
cboeDaily:update sym:`$"IEX" from cboeDaily where sym=`$"IEX (V)";
cboeDaily:update sym:`$"TRF" from cboeDaily where sym in trfs;cboeDaily:`date`sym xasc cboeDaily;
cboeDaily:0!select sum totalShares by date,sym from cboeDaily;

system "cd ",srcDir;
exchanges:asc exec distinct sym from cboeDaily;
default:exchanges!(count exchanges)#0;

marketVolumeByExch:0!exec (default,sym!totalShares) by date:date from cboeDaily;
`:marketVolumeByExch.json 0: enlist .j.j flip marketVolumeByExch;

mktShares:(select date,sym,totalShares from cboeDaily) lj select mktVolume:sum totalShares by date from cboeDaily;
mktShares:update mktShare:totalShares%mktVolume from mktShares;
marketShareByExch:0!exec (default,sym!mktShare) by date:date from mktShares;
`:marketShareByExch.json 0: enlist .j.j flip marketShareByExch;
