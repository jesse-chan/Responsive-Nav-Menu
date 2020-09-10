/*
 * RNM V 1.03
 * Responsive Navigation Menu
 * @author Jesse Chan <jesse.chan@hotmail.com>
 * @license MIT
 */

// hamburger icon html
let _rnm_icon_html_ = `<div class="-rnm-ham-icon-">
            <div class="-rnm-ham-icon-bar- -rnm-ham-icon-1-"></div>
            <div class="-rnm-ham-icon-bar- -rnm-ham-icon-2-"></div>
            <div class="-rnm-ham-icon-bar- -rnm-ham-icon-3-"></div>
        </div>`;

$.prototype.rnm = function(arg = null) {
    let tp = typeof(arg);
    if (tp === 'object') {
        if (this.prop('tagName') !== 'NAV')
            return;
        if (this.hasClass('-rnm-root-'))
            _rnm_destroy_(this);

        // assign id of .-rnm- if undefined and store counter
        let id = this.attr('id');
        if (id === undefined) {
            let counter = parseInt(sessionStorage.getItem('-rnm-counter-'));
            counter = (isNaN(counter))?0:(counter+1);
            id = '-rnm-' + counter + '-';
            this.attr('id', id);
            sessionStorage.setItem('-rnm-counter-', counter.toString());
        }
        // store original html into sessionStorage for recovery
        sessionStorage.setItem(id, this.html());
        let o = {
            'id': '#' + id,
            'zIndex':10,
            'autoExpand':true,
            'openSign':'▲',
            'closeSign':'▼',
            'dividerStyle':'1px solid black',
            'topLiSpacing':'10px',
            'topUlStyle':[
                'background:#bbbbbb;color:black;',    // nav
                'background:#bbbbbb;color:black;box-shadow:12px 12px 7px #777777;border:1px solid #777777;',    // ham
            ],
            'subUlStyle':[
                'background:#999999;color:black;box-shadow:12px 12px 7px #777777;border:1px solid #777777;',  // nav
                'background:#999999;color:black;box-shadow:12px 12px 7px #777777;border:1px solid #777777;',  // ham
            ],
            'topLiStyle':[
                'background:#bbbbbb;color:black;',    // normal
                'background:#777777;color:white;',    // hover or selected
                'background:#bbbbbb;color:#777777;'   // disabled
            ],
            'subLiStyle':[
                'background:#999999;color:black;',    // normal
                'background:#666666;color:orange;',   // hover or selected
                'background:#999999;color:#aaaaaa;'   // disabled
            ]
        };
        if (arg != null)
            Object.assign(o, arg)
        this.data(o);
        _rnm_initial_(this);
        _rnm_resize_({data:this});
    }
};
//====== initiation ======
// initial navigation menu
function _rnm_initial_(jroot) {
    // add customized css
    _rnm_init_css_(jroot);
    // add .-rnm- and z-index
    jroot.addClass('-rnm-root-');
    // add hamburger icon/set icon style/set event handler
    jroot.prepend(_rnm_icon_html_);
    $(jroot.data().id + ' .-rnm-divider-').append('<span>&nbsp;</span>');
    _rnm_initial_ham_icon_(jroot);
    // add classes
    _rnm_init_class_(jroot);
    // initial branch sign
    _rnm_init_branch_sign(jroot);
    // store data to relative elements
    _rnm_init_data_(jroot);
    // initial event handler
    _rnm_init_event_handler_(jroot);
}
// inject user defined css
function _rnm_init_css_(jroot) {
    let id = jroot.data().id;
    let s = '<style>';
    let sa = jroot.data('topLiSpacing');
    if (sa !== undefined)
        s += _rnm_css_string(id + ' .-rnm-top-li- > div, ' + id + ' .-rnm-sub-li- > div', 'padding: 0 ' + sa);
    sa = jroot.data('topUlStyle');
    if (sa !== undefined) {
        s += _rnm_css_string(id + '.-rnm-nav- .-rnm-top-ul-', sa[0]);
        s += _rnm_css_string(id + '.-rnm-ham- .-rnm-top-ul-', sa[1]);
    }
    sa = jroot.data('subUlStyle');
    if (sa !== undefined) {
        s += _rnm_css_string(id + '.-rnm-nav- .-rnm-sub-ul-', sa[0]);
        s += _rnm_css_string(id + '.-rnm-ham- .-rnm-sub-ul-', sa[1]);
    }
    sa = jroot.data('topLiStyle');
    if (sa !== undefined) {
        s += _rnm_css_string(id + ' .-rnm-top-li-', sa[0]);
        s += _rnm_css_string(id + ' .-rnm-top-li-:hover', sa[1]);
        s += _rnm_css_string(id + ' .-rnm-top-li-.-rnm-open-', sa[1]);
        s += _rnm_css_string(id + ' .-rnm-top-li-.-rnm-disabled-', sa[2]);
    }
    sa = jroot.data('subLiStyle');
    if (sa !== undefined) {
        s += _rnm_css_string(id + ' .-rnm-sub-li-', sa[0]);
        s += _rnm_css_string(id + ' .-rnm-sub-li-:hover', sa[1]);
        s += _rnm_css_string(id + ' .-rnm-sub-li-.-rnm-open-', sa[1]);
        s += _rnm_css_string(id + ' .-rnm-sub-li-.-rnm-disabled-', sa[2]);
    }
    sa = jroot.data('dividerStyle');
    if (sa !== undefined) {
        s += _rnm_css_string(id + '.-rnm-nav- .-rnm-top-li-.-rnm-divider-', sa, 'border-right');
        s += _rnm_css_string(id + '.-rnm-ham- .-rnm-top-li-.-rnm-divider-', sa, 'border-bottom');
        s += _rnm_css_string(id + ' .-rnm-sub-li-.-rnm-divider-', sa, 'border-bottom');
    }
    s += '</style>';
    $('head').append(s);
}
function _rnm_css_string(sl, s, st = '') {
    if ((s === undefined)||(s.trim() === ''))
        return '';
    if (st !== '')
        st += ':';
    if (s[s.length-1] !== ';')
        return (' ' + sl + '{' + st + s + ';}');
    else
        return (' ' + sl + '{' + st + s + '}');
}
function _rnm_init_class_(jroot) {
    // add .-rnm-lv0- .-rnm-top-ul-
    // store navLineHeight
    let tu = jroot.children('ul:first');
    tu.addClass('-rnm-top-ul- -rnm-lv0-').data('navLineHeight', jroot.css('height')).css('z-index', jroot.data().zIndex);
    // add .-rnm-top-li-
    // set the font-size of .-rnm-top-li-
    // set font-size 0 to .-rnm-top-ul- to avoid inline-block gaps
    // store lineHeight to .-rnm-top-li-
    let f = 0;
    $(jroot.data().id + ' .-rnm-lv0- > li').each(function () {
        let t = $(this);
        let lh = parseFloat(t.children('div').css('height'));
        let fs = t.css('font-size');
        if (parseFloat(fs) > f)
            f = parseFloat(fs);
        if (isNaN(lh))
            t.addClass('-rnm-top-li-').css({'font-size': fs});
        else
            t.addClass('-rnm-top-li-').css({'font-size': fs}).data('lineHeight', (lh + 8) + 'px');
    });
    $(jroot.data().id + ' .-rnm-lv0-').css('font-size', 0).data('level', 0);
    // calculate the top divider height
    let n = parseFloat(jroot.css('height'));
    if ((n-20) > (f + 16))
      jroot.data('dividerHeight', (n-20) + 'px');
    else {
      if ((f + 16) > n)
        jroot.data('dividerHeight', (n-8) + 'px');
      else
        jroot.data('dividerHeight', (f+16) + 'px');
    }
    // store dividerWidth to jroot
    let a = (jroot.data().dividerStyle === undefined)?[]:jroot.data().dividerStyle.split(' ');
    let w = 0;
    a.forEach(s=>{
        if (s.indexOf('px') > -1)
            w = parseFloat(s);
    });
    if (w > 0)
        jroot.data('dividerWidth', w + 'px');
    else
        jroot.data('dividerWidth', '0');
    //add -rnm-lv[n]- .-rnm-sub-ul- and .-rnm-branch- .-rnm-open- to parent li
    let lv = 0;
    let ul = $(jroot.data().id + ' .-rnm-top-li- > ul');
    while(ul.length > 0) {
        lv++;
        ul.addClass('-rnm-sub-ul- -rnm-lv' + lv + '-').data('level', lv).parent().addClass('-rnm-branch- -rnm-open-');
        ul = $('.-rnm-lv' + lv + '- > li > ul');
    }
    // store rnmMaxDepth to jroot
    jroot.data('rnmMaxDepth', lv);
    // add .-rnm-sub-li-
    $(jroot.data().id + ' .-rnm-sub-ul- > li').addClass('-rnm-sub-li-');
    // set line-height to divider
    $(jroot.data().id + ' .-rnm-sub-li-.-rnm-divider-').css({'line-height': jroot.data('dividerWidth')});
}
// initial branch sign
function _rnm_init_branch_sign(jroot) {
    jroot.find('.-rnm-branch-').each(function () {
        let t = $(this);
        let s = parseFloat(t.css('font-size'));
        let c = 'height:' + s + 'px;width:' + s + 'px;font-size:' + s + 'px;';
        let f = t.children('div:first');
        f.append('<div class="-rnm-close-sign-" style="' + c + '">' + jroot.data('close-sign') + '</div>');
        f.append('<div class="-rnm-open-sign-" style="' + c + '">' + jroot.data('open-sign') + '</div>');
    });
}
function _rnm_init_data_(jroot) {
    // store the width of .-rnm-sub-ul-
    // add .-rnm-sub-li- and set the line-height
    $(jroot.data().id + ' .-rnm-sub-li-').css('display', 'block');
    $(jroot.data().id + ' .-rnm-top-li-').css('display', 'inline-block');
    let l = jroot.data().rnmMaxDepth;
    while (l > 0) {
        $(jroot.data().id + ' .-rnm-lv' + l + '-').each(function () {
            let t = $(this);
            let w = parseFloat(t.css('width')) + 8;
            t.data('width', w + 'px');
        });
        $(jroot.data().id + ' .-rnm-lv' + l + '- > li').each(function () {
            let t = $(this);
            let lh = parseFloat(t.children('div').css('height'));
            if (isNaN(lh) === false)
                t.css('line-height', (lh + 8) + 'px');
        });
        l--;
    }

    $(jroot.data().id + ' .-rnm-branch-').removeClass('-rnm-open-').addClass('-rnm-close-');
    // calculate sum of -rnm-top-li- width
    let v = 0;
    $(jroot.data('id') + ' .-rnm-top-li-').each(function () {
        let t = $(this);
        if (t.css('display') !== 'none') {
            v += t.outerWidth(true);
            if (t.hasClass('-rnm-divider-'))
                v += 10;
        }
    });
    jroot.data('rnmTopUlWidth', (v+10));
    $(jroot.data().id + ' .-rnm-sub-li-').css('display', '');
    $(jroot.data().id + ' .-rnm-top-li-').css('display', '');
}
function _rnm_init_event_handler_(jroot) {
    $(window).on('resize', jroot, _rnm_resize_).on('click', jroot, _rnm_window_mouse_click_);
    $(jroot.data().id + ' .-rnm-top-li-,' + jroot.data().id + ' .-rnm-sub-li-').on('mouseenter', jroot, _rnm_li_enter_).on('mouseleave', jroot, _rnm_li_leave_).on('click', jroot, _rnm_li_click_);
}
//====== events handler ======
function _rnm_resize_(e) {
    let jroot = e.data;
    let w = jroot.outerWidth();
    let iw = 0;
    jroot.children().each(function (){
        let t = $(this);
        if ((t.hasClass('-rnm-top-ul-') === false)&&(t.hasClass('-rnm-ham-icon-') === false))
            iw += (t.outerWidth() + parseFloat(t.css('margin-left')) + parseFloat(t.css('margin-right')));
    });
    if ((parseFloat(jroot.css('width')) - iw) > jroot.data('rnmTopUlWidth')) {
        if (jroot.hasClass('-rnm-nav-') === false) {
            _rnm_nav_(jroot);
        }
    } else {
        if (jroot.hasClass('-rnm-ham-') === false) {
            _rnm_ham_(jroot);
        }
    }
    _rnm_close_all_(jroot);
}
function _rnm_li_enter_(e) {
    let jroot = e.data;
    let j = $(e.delegateTarget);
    if ((jroot.data().autoExpand)&&(j.hasClass('-rnm-branch-'))) {
        j.removeClass('-rnm-close-').addClass('-rnm-open-');
        if ($(jroot.data().id).hasClass('-rnm-nav-'))
            _rnm_nav_open_ul_(jroot, j);
    }
}
function _rnm_li_leave_(e) {
    let jroot = e.data;
    let j = $(e.delegateTarget);
    if ((jroot.data().autoExpand)&&(j.hasClass('-rnm-branch-'))) {
        j.removeClass('-rnm-open-').addClass('-rnm-close-');
    }
}
function _rnm_li_click_(e) {
    let jroot = e.data;
    let j = $(e.delegateTarget);
    if (j.hasClass('-rnm-branch-')) {
        if (j.hasClass('-rnm-open-')) {
            j.removeClass('-rnm-open-').addClass('-rnm-close-');
        } else {
            j.parents('.-rnm-open-').addClass('-rnm-flag-');
            $(jroot.data().id + ' .-rnm-open-').each(
                function () {
                    let t = $(this);
                    if (t.hasClass('-rnm-flag-') === false)
                        t.removeClass('-rnm-open-').addClass('-rnm-close-');
                }
            );
            $('.-rnm-flag-').removeClass('-rnm-flag-');
            j.removeClass('-rnm-close-').addClass('-rnm-open-');
            if ($(jroot.data().id).hasClass('-rnm-nav-'))
                _rnm_nav_open_ul_(jroot, j);
        }
    } else
        _rnm_close_all_(jroot);
    e.stopPropagation();
}
function _rnm_window_mouse_click_(e) {
    _rnm_close_all_(e.data);
}
//====== general functions ======
// switch to ham
function _rnm_ham_(jroot) {
    _rnm_close_all_(jroot);
    let tu = $(jroot.data().id + ' .-rnm-top-ul-');
    // remove .-rnm-nav-, add .-rnm-ham-
    jroot.removeClass('-rnm-nav- -rnm-open-').addClass('-rnm-ham- -rnm-close-')
    // set .-rnm-top-ul- .-rnm-top-li- css
    tu.css({'line-height': '', 'top': tu.data('navLineHeight'), 'height': '', 'display': ''});
    $(jroot.data().id + ' .-rnm-top-li- ').each(function (){
        let t = $(this);
        t.css('line-height', t.data('lineHeight'));
    });
    $(jroot.data().id + ' .-rnm-sub-ul-').css({'top': '', 'width': '', 'left': ''});
    $(jroot.data().id + ' .-rnm-top-li-.-rnm-divider-').css({'line-height': jroot.data('dividerWidth'), 'width': ''});
}
function _rnm_nav_(jroot) {
    _rnm_close_all_(jroot);
    let tu = $(jroot.data().id + ' .-rnm-top-ul-');
    // remove .-rnm-ham-, add .-rnm-nav-
    jroot.removeClass('-rnm-ham- -rnm-close-').addClass('-rnm-nav- -rnm-open-')
    // set .-rnm-top-ul- .-rnm-top-li- css
    tu.css({'line-height': tu.data('navLineHeight'), 'top': '0', 'height': tu.data('navLineHeight'), 'display': 'inline-block'});
    $(jroot.data().id + ' .-rnm-top-li- ').each(function (){
        let t = $(this);
        t.css('line-height', '');
    });
    $(jroot.data().id + ' .-rnm-top-li-.-rnm-divider-').css({'line-height': jroot.data('dividerHeight'), 'width': jroot.data('dividerWidth')});
    // adjust .-rnm-top-ul- position
    tu.css('top', (jroot.position().top - tu.position().top) + 'px');
}
// open sub ul at nav state
function _rnm_nav_open_ul_(jroot, j){
    let u = j.children('.-rnm-sub-ul-');
    if (j.parent().data('level') > 0) {
        let o = j.offset();
        let w = j.outerWidth();
        let r = window.innerWidth - o.left - w;
        u.css('top', '');
        let t = parseFloat(u.css('top')) - j.outerHeight();
        if (r > w) {
            u.css({'left': w + 'px', 'top': t + 'px', 'width': u.data('width')});
        } else {
            if (o.left > r) {
                u.css({'left': '-' + u.data('width'), 'top': t + 'px', 'width': u.data('width')});
            } else
                u.css({'width': u.data('width')});
        }
    } else {
        u.css({'width': u.data('width')});
    }
}
// close all sub ul
function _rnm_close_all_(jroot) {
    $(jroot.data().id + ' .-rnm-open-').removeClass('-rnm-open-').addClass('-rnm-close-');
    if (jroot.hasClass('-rnm-ham-'))
        jroot.removeClass('-rnm-open-').addClass('-rnm-close-');
}
// hamburger function
function _rnm_initial_ham_icon_(jroot) {
    let rh =  parseFloat(jroot.css('height'));
    let h = rh - 16;
    h = (h > 50)?50:h;
    let m = (rh - h)/2;
    $(jroot.data().id + '> .-rnm-ham-icon-').css({'width':h,'height':h,'margin-top': m + 'px','margin-bottom': m + 'px','margin-right': '10px'}).on('click', jroot, _rnm_ham_icon_toggle_);
}
function _rnm_ham_icon_toggle_(e) {
    let jroot = e.data;
    if (jroot.hasClass('-rnm-close-'))
        jroot.removeClass('-rnm-close-').addClass('-rnm-open-');
    else
        _rnm_close_all_(jroot);
    e.stopPropagation();
}
function _rnm_destroy_(jroot) {
    if (jroot.hasClass('-rnm-root-') === false)
        return;
    //remove event handler
    $(jroot.data().id + ' .-rnm-top-li-,' + jroot.data().id + ' .-rnm-sub-li-').off('mouseenter', _rnm_li_enter_).off('mouseleave', _rnm_li_leave_).off('click', _rnm_li_click_);
    $(window).off('resize', _rnm_resize_).off('click', _rnm_window_mouse_click_);
    // remove element data
    $.each(jroot.data(), function (i, v) {
        jroot.removeData(i);
    });
    // restore original html
    jroot.html(sessionStorage.getItem(jroot.attr('id')));
    sessionStorage.removeItem(jroot.attr('id'));
    // remove system assigned id
    let id = jroot.attr('id');
    if (id.indexOf('-rnm-') > -1)
        jroot.removeAttr('id');
    jroot.removeClass('-rnm-root-');
}
