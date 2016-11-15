from __future__ import division
b = 1/8  #SUPERHOR | SUBSCHOR ratio
t = 1/6  #SUPER | SUBSC ratio
class symbol:
    def __init__(self, idx, latex, x_max, x_min, y_max, y_min, centroid):
        self.idx   = idx
        self.latex = latex
        self.next = []

        x, y = centroid
        self.centroid = (int(x), int(y))

        self.x_max, self.x_min = (x_max, x_min)
        self.y_max, self.y_min = (y_max, y_min)
        self.__base()

    def set_next(self, sym):
        self.next = sym

    def __repr__(self):
        return "Symbol%d{%s(%s) => %d~%d, %d~%d}"%(self.idx, self.latex, self.centroid, self.x_min, self.x_max, self.y_min, self.y_max)

    def __base(self):
        inline_thres = 1/8 + 1/6
        super_thres  = 1 - inline_thres
        subsc_thres  = super_thres

        h = self.height()
        xc, yc = self.center()

        self.io = yc - inline_thres*h
        self.ib = yc + inline_thres*h
        self.so = self.io - super_thres*h
        self.sd = self.ib + subsc_thres*h

    def width(self):
        return self.x_max - self.x_min

    def height(self):
        return self.y_max - self.y_min

    def center(self):
        return ((self.x_max + self.x_min)/2, (self.y_max + self.y_min)/2)

    def location(self, base):
        x = self.centroid[1]
        base_h = base.height()
        self_h = self.height()
        thres = 1
        _super = _inline = _subsc = 0
        if x < base.so:
            return 2
        elif x >= base.so and x < base.io and base_h * thres > self_h:
            return 1
        elif x >= base.io and x < base.ib:
            return 0
        elif x >= base.ib and x < base.sd and base_h * thres > self_h:
            return -1
        else:
            return -2
    def gen_tex(self):
        res = self.latex
        while len(self.next) != 0:
            location, _next = self.next.pop(0)
            if location == 1:
                res += "^{%s}"%(_next.gen_tex())
            elif location == 0:
                res += _next.gen_tex()
            elif location == -1:
                res += "_{%s}"%(_next.gen_tex())
        return res


