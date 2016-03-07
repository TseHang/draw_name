/*---------//
<未除BUG>
1.若要使用highlight效果，welcome block會擋住node 而無法點擊
(現在只要先選其他隨便沒被擋住的一顆，即可解除狀況！)
2.autoplay 完回來change_toggle = 0，會變成狂暴狀態！！？ ==> 按空白鍵可回復....
 //----------*/

//Firebase 資料庫
//公用的 var myDataRef = new Firebase('https://o47un23yblt.firebaseio-demo.com/');
var myDataRef = new Firebase('https://flickering-heat-4075.firebaseio.com');
var nodeList = myDataRef.child('nodes');
var nameList = myDataRef.child('nameRecord');

//半徑
var r = 0 , radius = 0;

$('#messageInput').keypress(function(e) {
    if (e.keyCode == 13) {

        var name = $('#nameInput').val();
        var sex = $('#sexualInput').val();
        var school = $('#schoolInput').val();
        var department = $('#departmentInput').val();
        var area = $('#whereInput').val();
        var star = $('#starInput').val();
        var message = $('#messageInput').val();
        var age = $('#ageInput').val();
        var setNum = setChangeNum( school , age , area, sex , star);		//輸入陣列變數

        //後端資料庫
        nodeList.push({
            'name': name,
            'sex': sex,
            'school': school,
            'department': department,
            'area': area,
            'star': star,
            'age': age,
            'message': message,
            'setNum': setNum
        });

        nameList.push({
            'name':name
        });

        //輸入完之後清空想說的話
        $('#messageInput').val('');
        
    };

    //可以輸入空白鍵
    if ( e.keyCode == 32 ) {
    	stop_toggle = 1;
    }

});



function setChangeNum( school , age , area, sex ,star)
{
	switch ( school )
	{
		case "文學院" :
		case "管理學院" :
		case "社會科學院" :
			school = 1 ; break ;
		case "理學院" :
		case "工學院" :
		case "生物科學與科技學院" :
			school = 2 ; break ;
		case "電機資訊學院" :
			school = 3 ; break ;
		case "規劃與設計學院" :
		case "醫學院" :
			school = 4 ; break ;
		default:
			school = 0; break ;
	}
	switch(area)
	{
		case "北部":
			area = 1 ; break;
		case "東部":
			area = 2 ; break;
		case "中部":
			area = 3 ; break;
		case "南部":
			area = 4 ; break;
		default:
			area = 0 ;
	}
    switch(age)
    {
        case "大一":
            age = 1 ; break;
        case "大二":
            age = 2 ; break;
        case "大三":
            age = 3 ; break;
        case "大四":
            age = 4 ; break;
        default:
            age = 0 ;
    }
    switch(sex)
    {
        case "man":
            sex = 1 ; break;
        case "woman":
            sex = 2 ; break;
        default:
            sex = 0 ;
    }
	switch(star)
	{
		case "牡羊座" :
		case "獅子座" :
		case "射手座" :
			star = 1 ; break;
		case "金牛座" :
		case "處女座" :
		case "摩羯座" :
			star = 2 ; break;
		case "雙子座" :
		case "天秤座" :
		case "水瓶座" :
			star = 3 ; break;
		case "雙魚座" :
		case "巨蟹座" :
		case "天蠍座" :
			star = 4 ; break;
		default :
			star = 0 ; break;
	}

	var setNum = [school , age , area , sex ,star] ;

	return setNum;
}

