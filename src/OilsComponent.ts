class OilsComponent extends BaseComponent {
	private drawMc: eui.Group;
	private sp: egret.Sprite;

	private start: egret.Point;


	private cleanBtn: eui.Button;
	private uploadBtn: eui.Button;

	private probTxt:eui.Label;
	private resTxt:eui.Label;

	public constructor() {
		super("resource/skins/OilsSkin.exml");

		this.percentWidth=100;
		this.percentHeight=100;
	}

	public initUI(): void {
		this.sp = new egret.Sprite();
		this.drawMc.addChild(this.sp);
	}

	public initEvent(b: boolean = true): void {
		if (b) {
			this.drawMc.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.__drawMoveHandler, this);
			this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.__endTouchHandler, this);

			this.cleanBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.__touchTapHandler, this);
			this.uploadBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.__uploadHandler, this);
		} else {

		}
	}

	private __uploadHandler(e: egret.TouchEvent): void {
		var renderTexture: egret.RenderTexture = new egret.RenderTexture();
		let b = renderTexture.drawToTexture(this.drawMc);
		console.log(b);

		let str = renderTexture.toDataURL("image/jpeg", new egret.Rectangle(0, 0, 560, 560));

		this.uploadData(str);
	}

	private __touchTapHandler(e: egret.TouchEvent): void {
		this.sp.graphics.clear();
		this.probTxt.text="";
		this.resTxt.text="";
	}

	private __drawMoveHandler(e: egret.TouchEvent): void {
		this.sp.graphics.lineStyle(100, 0xffffff)

		if (this.start == null) {
			this.sp.graphics.moveTo(e.localX, e.localY);
		} else {
			this.sp.graphics.moveTo(this.start.x, this.start.y);
		}

		this.sp.graphics.lineTo(e.localX, e.localY);
		this.start = new egret.Point(e.localX, e.localY);
		this.sp.graphics.endFill();
	}

	private __endTouchHandler(e: egret.TouchEvent): void {
		this.start = null;
	}

	/**
     * 把base64上传给服务器
     * @param base64Str 图片的base64数据
     */
	private uploadData(base64Str: string) {
		let vars: egret.URLVariables = new egret.URLVariables();
		vars.decode("base=" + base64Str);
		HttpHandler.sendMsgCallBack("http://alpxe.com:1234/tensorflow/mnist", vars, this.__resultHandler, egret.URLRequestMethod.POST, this);
	}


	private __resultHandler(json:any): void {
		let str:string="";
		let index:number=0;
		let resMax:number=0;
		let res:number=0;

		for (let i of json.num) {
			str+="数字为"+index+"的概率为"+ (i*100).toFixed(2) +"% \n";
			if(i>resMax){
				resMax=i;
				res=index;
			}

			index++;
		}

		this.probTxt.text=str;
		this.resTxt.text=res.toString();
	}
}