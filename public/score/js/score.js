$('.checkBtn').on("click", function() {
	var userInput = $(".check").val()
	check(userInput)
})

function check(input) {
	if(input.match(',') || input.match('，')) {
		console.log("查询成绩")
	} else if(input.length < 18) {
		alert("身份证号位数不够")
	} else {
		$.ajax({
			type: "post",
			url: "/api/cetscore",
			data: {
				id: input
			},
			contentType: "application/x-www-form-urlencoded",
			timeout: 2000,
			success: function(res) {
				$('#myModal').modal('show')
				$(".scoreList").html("")
				scoreShow(res)
			},
			error: function() {
				alert("服务器正忙，请稍等一下")
			}
		})
	}
}

function scoreShow(score) {
	var cet4 = [
		"姓名",
		"学校",
		"考试科目",
		"准考证号",
		"总分",
		"听力",
		"阅读",
		"写作和翻译"
	]
		cet4.map(function(node, idx) {
			var tr = document.createElement("tr")
			var tdname = document.createElement("td")
			var tdscore = document.createElement("td")
			$(tdname).html(node)
			$(tdscore).html(score[idx])
			$(tr).append(tdname)
			$(tr).append(tdscore)
			$(".scoreList").append(tr)
		})
	
}

	//
	//$(".check").on("input")