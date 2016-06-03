
    {% for item in data %}
    <li class="ui-border-t ui-list-item">
        <h1 class="li-index">{{ loop.index + 4 }}</h1>
        <div class="ui-avatar">
            <span style="background-image:url({{ item.logo }})"></span>
        </div>
        <div class="ui-list-info">
            <h4 class="ui-nowrap">{{ item.name }}</h4>
            <p class="ui-nowrap"><span>动态:{{ item.msg }}</span>/<span>关注:{{ item.follow }}</span></p>
        </div>
        <div class="ui-sign">昨天<span class="number">{{ item.sign }}</span>人签到</div>
    </li>
    {% endfor %}