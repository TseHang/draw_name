# draw_name_system
A funny game to draw a name with firebase, and analysize some info.

		一個用firebase做的簡易報名系統，一顆球即代表一個人，分析的資料越多，可呈現的資訊越多！

## 注意
		請用自己的firebase資料庫才不會與別人撞到

## Function
- Z : 暫停/開始
- X : 變換成殘酷顏色
- A : 顯示分析的數據
- S : 看心理測驗結果(change_toggle = 6 || 7)
- , : 回到最初始狀態( 轉轉轉～～ ) 
- . : autoplay
- / : 切換分析狀態
- enter : 無重力狀態/回溯

## Node 屬性說明
- radius : 決定顏色domain (18~28)
- name : 名子
- school : 學院
- department : 系所
- area : 哪裡人
- message : 想說的話
- r : 半徑 (8~18)
- setNum : 決定資料經分析後的位置 [school , age , area , sex , mental_1 , mental_2] 