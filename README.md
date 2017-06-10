# switchcity
---
〖原创〗微信小程序--切换城市demo
---

> 城市切换是大多数app的必备功能，下面是一个基于微信小程序开发的demo。该demo继承于[微信小程序实用组件：城市切换](http://www.wxapp-union.com/thread-1644-1-1.html)，更换了里面内置的数据源（因为使用后发现好几个城市没有，居然连上海都没有也是醉了），添加搜索功能。

### 下载源码

本文章示例可以通过以下命令下载：

~~~ shell
git clone https://github.com/smk17/switchcity.git
~~~
该源码有两个目录，demo为城市切换组件源码，可直接在微信小程序开发工具中使用，pinyin为用Python写的脚本，要是你们有更好的数据源克自己修改。

### 更换数据源

在更换数据源上我用Python写了个脚本把从[省市区json数据](https://www.oschina.net/code/snippet_149862_53831)获取的数据进行转化成需要的数据，具体代码如下：

~~~ Python
#!/usr/bin/python
# -*- coding:utf-8 -*-
from pinyin import PinYin
import json
data = [] # 省市区json数据,数据量过大就不写这里了，可以看源码
clist = []
index = 0
test = PinYin()
test.load_word()
for d in data:
	city = d['name']
	if city not in ['市辖区','郊区','县','城区','矿区','自治区直辖县级行政区划'] and '省' not in city and d['level'] < 3 :
		if '市' in city :
			city = city.decode('utf8')[0:-1].encode('utf8')
			pass
		elif '特别行政区' in city :
			city = city.decode('utf8')[0:-5].encode('utf8')
			pass
		elif '自治' in city :
			city = city.decode('utf8')[0:-3].encode('utf8')
			pass
		elif '地区' in city :
			city = city.decode('utf8')[0:-2].encode('utf8')
			pass
		tmpObj = {}
		tmpObj['id'] = str(index)
		tmpObj['code'] = d['code']
		tmpObj['city'] = city
		initial = test.hanzi2pinyin(string=d['name'])
		tmpObj['initial'] = initial[0].upper()[0:1]
		clist.append(tmpObj)
		index += 1
		pass
	pass
d1 = json.dumps(clist)
# d1 = json.loads(d1)
print d1
~~~

### 添加搜索功能

~~~ javascript
function  coverString(subStr,str){
	return str.toLowerCase().indexOf(subStr.toLowerCase())>-1;
}

function searchPinyin(city){
	var tempObj=[];
	for (var i = 0; i < cityObj.length; i++) {
		let citypy = pinyin.getFullChars(cityObj[i].city);
        let citysxpy = pinyin.getCamelChars(cityObj[i].city);
        if ( coverString(city,citypy) || coverString(city,citysxpy) ) {
            tempObj.push(cityObj[i]);
        }
    }
    return tempObj;
}

function searchHanzi(city){
	var tempObj=[];
	for (var i = 0; i < cityObj.length; i++) {
        if ( cityObj[i].city.search(city) > -1 ) {
            tempObj.push(cityObj[i]);
        }
    }
    return tempObj;
}

function searchCity(city){
	var reg= /^[A-Za-z]+$/;
	if (reg.test(city)) //判断是否符合正则表达式
	{
		return searchPinyin(city);
	} else {
		return searchHanzi(city);
	};
}
~~~

### 效果图：

![demo](demo.gif)

### 已知bug：

搜索功能目前对于多音字的处理还不是很好。。。

### 参考资料：

[微信小程序实用组件：城市切换](http://www.wxapp-union.com/thread-1644-1-1.html)

[汉字转换为拼音的JavaScript库](https://my.oschina.net/tommyfok/blog/202412)

[汉字转拼音,With Python](https://github.com/cleverdeng/pinyin.py)

[省市区json数据](https://www.oschina.net/code/snippet_149862_53831)
