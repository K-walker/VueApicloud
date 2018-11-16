define(function () {
	return {
        template:'<div class="ch-drop-down" :style="sty">'+
                    '<div class="drop-down-input">'+
                        '<input type="text" readonly :placeholder="placeholder" v-model="dropdownValue" @click.stop="isShow = !isShow">'+
                        '<div class="drop-down-arrow" :style="arrowSty" @click.stop="isShow = !isShow">'+
                            '<i></i>'+
                        '</div>'+
                    '</div>'+
                    '<ul class="drop-down-list" v-show="isShow" :style="{maxHeight:maxHeight}">'+
                        '<li '+
                            'v-for="(item , index) in data" '+
                            ':key="index" '+
                            '@click="onClickDropdownItem(item)">{{item[label] || item}}</li>'+
                    '</ul>'+
                '</div>',
        data:function () {
            return {
                isShow:false,
                dropdownValue:'',
                sty:{
                    width:this.width,
                    height:this.height
                },
                arrowSty:{
                    height:this.height,
                    'line-height':this.height,
                    top:'calc(50% - '+(parseInt(this.height) / 2)+'px)'
                }
            }
        },
        props:{
            data:{
                type:Array,
                default:[]
            },
            placeholder:String,
            label:String,
            width:{
                type:String,
                default:'160px'
            },
            height:{
                type:String,
                default:'30px'
            },
            maxHeight:{
                type:String,
                default:'160px'
            }
        },
        methods:{
            onClickDropdownItem:function (item) {
                this.isShow = false ;
                this.dropdownValue = item[this.label] || item ;
                this.$emit('item-click' , item);
            }
        }
    }
})