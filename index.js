/*---------//
<未除BUG>
1.若要使用highlight效果，welcome block會擋住node 而無法點擊
(現在只要先選其他隨便沒被擋住的一顆，即可解除狀況！)
2.autoplay 完回來change_toggle = 0，會變成狂暴狀態！！？ ==> 按空白鍵可回復....
 //----------*/


var color = d3.scale.linear().domain([8, 13, 18, 20]).range(["#E7E879", "#50B584", "#3E8E68", "#23632F"]);
var color_sex = d3.scale.linear().domain([1, 2]).range(["#309ac1", "#eb6f70"])
var color_star = d3.scale.linear().domain([1, 2, 3, 4]).range(["#D33948", "#FCDFA6", "#95BF95", "#87F5FB"])
    //range(["#ffffe0", "#800000"]);

var width = 900 , height = 800;
var svg = d3.select("svg");

var nodes = [];
var node = svg.selectAll(".node");

// 4點位置座標
var foci = [{ x: 300, y: 650 }, { x: -800, y: -600 }, { x: 1400, y: -600 }, { x: -800, y: 1000 }, { x: 1400, y: 1000 }];
var foci_two = [{ x: 300, y: 1000 }, { x: -800, y: 400 }, { x: 1400, y: 400 }];
/* 12點位置座標
var foci_star = [{x: 400 , y:2000} , {x: -1000 , y: -700},{x: -100 , y: -700} , {x :800 , y :-700} , {x :1700 , y :-700} ,{x: -800 , y: 400},{x: 0 , y: 400} , {x :800 , y :400} , {x :1600 , y :400} , {x: -1000 , y: 1500},{x: -100 , y: 1500} , {x :800 , y :1500} , {x :1700 , y :1500}];
*/

var stop_toggle = 0, change_toggle = 0, autoplay_toggle = 0, color_toggle = 0;
var autoInterval_id;
/*-----------------------------
change_toggle =>    0:初始狀態
                    1:無重力
                    2:院所分類
                    3:系級
                    4:哪裡人
                    5:性別
                    6:星座分類
------------------------------ */

function tick(e) {

    //e.alpha （ tick 裡的 alpha 值 )
    var k = .1 * e.alpha;

    //  利用按鍵改變模式
    if (change_toggle == 0) {
        // Push nodes toward their designated focus.
        // forEach(value , index , obj)
        nodes.forEach(function(o, i) {
            o.y += (250 - o.y + 100) * k;
            o.x += (450 - o.x) * k;

            var r = Math.sqrt(Math.pow(o.x - 400, 2) + Math.pow(o.y - 200, 2));
            if (r < 110 && r != 0) {
                o.x += 1.1 * (o.x - 400) / r;
                o.y += 1.1 * (o.y - 200) / r;
            } else if (r > 140 && r != 0) {
                o.x -= 1.1 * (o.x - 400) / r;
                o.y -= 1.1 * (o.y - 400) / r;
            }
        });

        //撞擊
        //quadtree 一種很棒的搜尋方式，增加效率！
        var q = d3.geom.quadtree(nodes),
            i = 0,
            n = nodes.length;
        while (++i < n) q.visit(collide(nodes[i]));

    } else if (change_toggle == 1)
        force.gravity(0);
    else if (change_toggle == 2) {
        force.gravity(0.4);

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            o.y += (foci[o.setNum[0]].y - o.y) * k;
            o.x += (foci[o.setNum[0]].x - o.x) * k;
        });
    } else if (change_toggle == 3) {
        force.gravity(0.4);

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            o.y += (foci[o.setNum[1]].y - o.y) * k;
            o.x += (foci[o.setNum[1]].x - o.x) * k;
        });
    } else if (change_toggle == 4) {
        force.gravity(0.4);

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            o.y += (foci[o.setNum[2]].y - o.y) * k;
            o.x += (foci[o.setNum[2]].x - o.x) * k;
        });
    } else if (change_toggle == 5) {
        force.gravity(0.4);

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            o.y += (foci_two[o.setNum[3]].y - o.y) * k;
            o.x += (foci_two[o.setNum[3]].x - o.x) * k;
        });
    } else if (change_toggle == 6) {
        force.gravity(0.4);

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            o.y += (foci[o.setNum[4]].y - o.y) * k;
            o.x += (foci[o.setNum[4]].x - o.x) * k;
        });
    }


    d3.selectAll("circle")
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        })

    d3.selectAll(".g_text")
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        })

    force.alpha(0.02);
}

//建立layout , force !!
var force = d3.layout.force()
    .nodes(nodes) //綁定資料
    .gravity(0)
    .size([width, height]) //設定範圍
    .charge(function(d) {
        return 20 * -d.radius;
    })
    .on("tick", tick);

//Firebase 資料庫
var i = 0;
//公用的 
var myDataRef = new Firebase('https://o47un23yblt.firebaseio-demo.com/');


//半徑
var r = 0, radius = 0;

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
        var setNum = setChangeNum( school , age , area, sex , star);        //輸入陣列變數

        //後端資料庫
        myDataRef.push({
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

        //輸入完之後清空想說的話
        $('#messageInput').val('');

        //出現歡迎box
    $('#welcome_text').html("~歡迎 :&nbsp;&nbsp;<em><span id = \"welcome_name\">" + name + "</span></em>&nbsp;&nbsp;&nbsp;到來~");

    $("#welcome").fadeTo("slow", 1);
    $("#welcome").delay(700).fadeTo("normal", 0);

    //放大球球 (已經i++後了 , 所以要-1)
    d3.select("#circle" + (i - 1))
        .transition()
        .duration(1000)
        .attr("r", 200)
        .transition()
        .duration(500)
        .attr("r", r);
        
    };

    //可以輸入空白鍵
    if ( e.keyCode == 32 ) {
        stop_toggle = 1;
    }
});



// space    => 無重力狀態
//  z       => 暫停/開始
//  x       => 換成殘酷的男女顏色
//  /       => 切換狀態
//  .       => 自動播放 (change_toggle 從你現在狀態開始)
//  ,       => 回復初始狀態(change_toggle = 0)
$('body').keypress(function(e) {
    console.log(e.keyCode);

    //stop_toggle => 控制stop
    if (e.keyCode == 122 || e.keyCode == 12552) {
        if (stop_toggle == 0) {
            force.stop();

            //檢查是否在自動播放狀態（文字也要停掉）
            if (autoplay_toggle == 1)
                window.clearInterval(autoInterval_id);

            stop_toggle = 1;
        } else {
            force.resume();

            if (autoplay_toggle == 1)
                autoInterval_id = window.setInterval("slideFlow()", 2000);

            stop_toggle = 0;
        }
    }
    if (e.keyCode == 120 || e.keyCode == 12556) {
        if (color_toggle == 0) {
            d3.selectAll(".circle").style("fill", function(d) {
                    return color_sex(d.setNum[3]);
                }) //依照性別去選顏色

            color_toggle = 1;
        } else {
            d3.selectAll(".circle").style("fill", function(d) {
                    return color(d.radius);
                }) //原本顏色

            color_toggle = 0;
        }
    }
    //change_toggle = 1
    if (e.keyCode == 32) {

        //隱藏 name_text
        $('.name_text').css("opacity", 0);

        if (change_toggle != 1) {
            change_toggle = 1;
            window.clearInterval(autoInterval_id);

            force.charge(-30);
        } else {
            change_toggle = 0;
        }
    }
    //change_toggle = 2.3.4....
    if (e.keyCode == 47 || e.keyCode == 12581) {
        //explosion();
        slideFlow();
    }
    //自動播放 toggle 從現在狀態開始
    if (e.keyCode == 46 || e.keyCode == 12577) {
        console.log("autoplaytoggle:" + autoplay_toggle);

        if (autoplay_toggle == 0) {

            autoInterval_id = window.setInterval("slideFlow()", 2000)
            autoplay_toggle = 1;
        } else {
            //隱藏 name_text
            $('.name_text').css("display", "none");
            window.clearInterval(autoInterval_id);
            change_toggle = 0;
            autoplay_toggle = 0;
        }
    }

    if (e.keyCode == 44 || e.keyCode == 12573) {
        //隱藏 name_text
        $('.name_text').css("opacity", 0);

        if (autoplay_toggle == 1)
            window.clearInterval(autoInterval_id);

        change_toggle = 0;
    }
});


// 後端data 傳回來
// Math.random() => 0 ~ 0.99999
myDataRef.on('child_added', function(snapshot) {

    //擷取資料 => myDateRef
    var person = snapshot.val();

    console.log(person.age);
    //用age 判斷r
    radius = setRadius(person.age);

    //Add nodes
    nodes.push({
        'radius': radius,
        'name': person.name,
        'sex': person.sex,
        'school': person.school,
        'department': person.department,
        'area': person.area,
        'star': person.star,
        'message': person.message,
        'age': person.age,
        'setNum': person.setNum
    });

    r = parseInt(radius);

    //開始forcelayout!!
    force.start();
    node = node.data(nodes);

    node.enter().append("g")
        .attr("class", "node")
        .attr("id", "ID" + i);

    d3.select("#ID" + i).append("circle")
        .attr("class", "circle")
        .attr("id", "circle" + i)
        .attr("r", r) // 半徑範圍: 8 ~ 18
        .style("fill", function(d) {
            if (change_toggle == 5)
                return color_sex(d.setNum[3]); //性別色
            else if (change_toggle == 6)
                return color_star(d.setNum[4]); //星座色
            else return color(d.radius); //原色
        })
        .call(force.drag)
        .on('dblclick', highlightNodes); // Highlight Effect!


    d3.select("#ID" + i).append("text")
        .attr("class", "g_text")
        .attr("dx", 20)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.name
        });

    console.log(nodes);
    console.log(i)

    //計算node 數量
    i++;

    
});


//Colide Function
function collide(node) {
    var r = node.radius + 20,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = node.radius + quad.point.radius;
            if (l < r) {
                //0.8 表撞擊彈出力道
                l = (l - r) / l * .8;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
            }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}

var toggle = 0;

function highlightNodes() {

    if (toggle == 0) {

        //讓welcome block 消失，才不會擋住點擊效果
        $("#welcome").delay(2000).css("display", "none");

        //Reduce the opacity of all but the neighbouring nodes
        d3.selectAll(".circle").style("opacity", 0.1);
        d3.selectAll(".g_text").style("opacity", 0.1);
        d3.selectAll(".name_text").style("opacity", 0);
        d3.select(this).style("opacity", 1);

        toggle = 1;

    } else {
        //Put them back to opacity=1
        d3.selectAll(".circle").style("opacity", 1);
        d3.selectAll(".g_text").style("opacity", 1);
        toggle = 0;

        if (change_toggle == 0 || change_toggle == 1)
            d3.selectAll(".name_text").style("opacity", 0);
        else
            d3.selectAll(".name_text").style("opacity", 1);
    }

}

function slideFlow() {
    console.log("change_toggle:" + change_toggle);
    //隱藏 name_textx
    $('.name_text').css("opacity", 0);
    $(".name_text").fadeTo("fast", 1);

    if (change_toggle == 0 || change_toggle == 6) {
        change_toggle = 2;

        //set "name_text"
        $('#text_1').text("文、管理、社科學院");
        $('#text_2').text("理、工、生科學院");
        $('#text_3').text("電機資訊學院");
        $('#text_4').text("規設、醫學院");
        $('#text_5').text("");
        $('#text_6').text("");
        $('#text_7').text("");
        d3.selectAll(".circle").style("fill", function(d) {
                return color(d.radius);
            }) //依照星座去選顏色

    } else {
        change_toggle++;

        if (change_toggle == 3) {
            $('#text_1').text("大一新鮮人");
            $('#text_2').text("大二過來人");
            $('#text_3').text("大三老屁股");
            $('#text_4').text("大四QAQ");
            $('#text_5').text("????");
            $('#text_6').text("");
            $('#text_7').text("");

        }
        if (change_toggle == 4) {
            $('#text_1').text("北部人");
            $('#text_2').text("中部人");
            $('#text_3').text("東部人");
            $('#text_4').text("南部人");
            $('#text_5').text("");
            $('#text_6').text("");
            $('#text_7').text("");

        }
        if (change_toggle == 5) {
            $('#text_1').text("");
            $('#text_2').text("");
            $('#text_3').text("");
            $('#text_4').text("");
            $('#text_5').text("");
            $('#text_6').text("Boys!!");
            $('#text_7').text("Girls!!");

            d3.selectAll(".circle").style("fill", function(d) {
                    return color_sex(d.setNum[3]);
                }) //依照性別去選顏色
        }
        if (change_toggle == 6) {
            $('#text_1').text("火象星座");
            $('#text_2').text("土象星座");
            $('#text_3').text("風象星座");
            $('#text_4').text("水象星座");
            $('#text_5').text("");
            $('#text_6').text("");
            $('#text_7').text("");

            d3.selectAll(".circle").style("fill", function(d) {
                    return color_star(d.setNum[4]);
                }) //依照星座去選顏色
        }
    }

}

function setRadius(age) {
    var r = Math.random() * 10;
    switch (age) {
        case "大一":
            while (r > 9.9 || r < 8)
                r = Math.random() * 10;
            return r;
        case "大二":
            while (r > 12.9 || r < 10)
                r = Math.random() * 10 + 3;
            return r;
        case "大三":
            while (r > 14.9 || r < 13)
                r = Math.random() * 10 + 5;
            return r;
        case "大四":
            while (r > 16.9 || r < 15)
                r = Math.random() * 10 + 7;
            return r;
        case "碩博":
            while (r > 18.9 || r < 17)
                r = Math.random() * 10 + 9;
            return r;
        default:
            return 21;
    }
}
//爆炸 => 還未用到
function explosion() {
    nodes.forEach(function(o, i) {
        o.x += (Math.random() - .5) * 80;
        o.y += (Math.random() - .5) * 100;
    });
    force.resume();
}
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
        case "中部":
            area = 2 ; break;
        case "東部":
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

